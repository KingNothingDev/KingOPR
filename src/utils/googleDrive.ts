const DRIVE_PARENT_FOLDER_ID = '18QBfEKG4HxqMb6DpCGxxRFEvD6xGy_Zc';

export interface DriveUploadedFile {
  id: string;
  name: string;
  webViewLink?: string;
  folderId: string;
  folderName: string;
  folderUrl: string;
}

export interface DriveFolderFileItem {
  id: string;
  name: string;
  webViewLink: string;
  modifiedTime?: string;
  size?: string;
}

export interface UserDriveFolderState {
  folderId: string;
  folderName: string;
  folderUrl: string;
  files: DriveFolderFileItem[];
}

export class DriveAuthExpiredError extends Error {
  constructor() {
    super('Your Google Drive session expired. Please sign in again.');
  }
}

export function getUserFolderName(
  email?: string | null,
  displayName?: string | null
): string {
  const raw = (email || displayName || 'OPR-User').trim();
  return raw.replace(/[/\\<>:"|?*]/g, '_').slice(0, 120) || 'OPR-User';
}

async function findOrCreateUserSubfolder(
  folderName: string,
  accessToken: string
): Promise<{ id: string; name: string; webViewLink?: string }> {
  const escapedName = folderName.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const query = `'${DRIVE_PARENT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${escapedName}' and trashed = false`;

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,webViewLink)&includeItemsFromAllDrives=true&supportsAllDrives=true&pageSize=1`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (searchRes.status === 401) {
    throw new DriveAuthExpiredError();
  }

  const searchData = (await searchRes.json().catch(() => null)) as {
    files?: { id: string; name: string; webViewLink?: string }[];
    error?: { message?: string };
  } | null;

  if (!searchRes.ok) {
    throw new Error(
      searchData?.error?.message ||
        `Unable to access your Drive folder (HTTP ${searchRes.status}).`
    );
  }

  if (searchData?.files && searchData.files.length > 0) {
    return searchData.files[0];
  }

  const createRes = await fetch(
    'https://www.googleapis.com/drive/v3/files?supportsAllDrives=true&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [DRIVE_PARENT_FOLDER_ID],
      }),
    }
  );

  if (createRes.status === 401) {
    throw new DriveAuthExpiredError();
  }

  const created = (await createRes.json().catch(() => null)) as {
    id?: string;
    name?: string;
    webViewLink?: string;
    error?: { message?: string };
  } | null;

  if (!createRes.ok || !created?.id) {
    throw new Error(
      created?.error?.message ||
        `Failed to create folder "${folderName}" in Drive (HTTP ${createRes.status}).`
    );
  }

  return {
    id: created.id,
    name: created.name || folderName,
    webViewLink: created.webViewLink,
  };
}

export async function listUserFolderContents(
  accessToken: string,
  userEmail?: string | null,
  userDisplayName?: string | null
): Promise<UserDriveFolderState> {
  const folderName = getUserFolderName(userEmail, userDisplayName);
  const subfolder = await findOrCreateUserSubfolder(folderName, accessToken);
  const folderUrl =
    subfolder.webViewLink ||
    `https://drive.google.com/drive/folders/${subfolder.id}`;

  const filesQuery = `'${subfolder.id}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`;
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      filesQuery
    )}&orderBy=modifiedTime%20desc&fields=files(id,name,webViewLink,modifiedTime,size)&includeItemsFromAllDrives=true&supportsAllDrives=true&pageSize=50`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (res.status === 401) {
    throw new DriveAuthExpiredError();
  }

  const payload = (await res.json().catch(() => null)) as {
    files?: {
      id: string;
      name: string;
      webViewLink?: string;
      modifiedTime?: string;
      size?: string;
    }[];
    error?: { message?: string };
  } | null;

  if (!res.ok) {
    throw new Error(
      payload?.error?.message ||
        `Unable to load files from your folder (HTTP ${res.status}).`
    );
  }

  const files: DriveFolderFileItem[] = (payload?.files || []).map((f) => ({
    id: f.id,
    name: f.name,
    webViewLink:
      f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
    modifiedTime: f.modifiedTime,
    size: f.size,
  }));

  return {
    folderId: subfolder.id,
    folderName: subfolder.name,
    folderUrl,
    files,
  };
}

export async function uploadPdfCopyToDriveFolder(
  pdfBlob: Blob,
  fileName: string,
  accessToken: string,
  userEmail?: string | null,
  userDisplayName?: string | null
): Promise<DriveUploadedFile> {
  const folderName = getUserFolderName(userEmail, userDisplayName);
  const subfolder = await findOrCreateUserSubfolder(folderName, accessToken);

  const boundary = `opr_drive_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const metadata = {
    name: fileName,
    mimeType: 'application/pdf',
    parents: [subfolder.id],
  };

  const multipartBody = new Blob(
    [
      `--${boundary}\r\n`,
      'Content-Type: application/json; charset=UTF-8\r\n\r\n',
      JSON.stringify(metadata),
      `\r\n--${boundary}\r\n`,
      'Content-Type: application/pdf\r\n\r\n',
      pdfBlob,
      `\r\n--${boundary}--`,
    ],
    { type: `multipart/related; boundary=${boundary}` }
  );

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: multipartBody,
    }
  );

  if (response.status === 401) {
    throw new DriveAuthExpiredError();
  }

  const data = (await response.json().catch(() => null)) as {
    id?: string;
    name?: string;
    webViewLink?: string;
    error?: { message?: string };
  } | null;

  if (!response.ok || !data?.id) {
    const apiMessage =
      data?.error?.message ||
      `Google Drive upload failed (HTTP ${response.status}).`;
    throw new Error(apiMessage);
  }

  return {
    id: data.id,
    name: data.name || fileName,
    webViewLink:
      data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
    folderId: subfolder.id,
    folderName: subfolder.name,
    folderUrl:
      subfolder.webViewLink ||
      `https://drive.google.com/drive/folders/${subfolder.id}`,
  };
}
