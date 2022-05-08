using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Security.Cryptography;

namespace Update
{
    public class AbsoluteFile
    {
        public event EventHandler FinishDeleteFileEvent = null;

        public event EventHandler FinishDeleteFolderEvent = null;

        public event EventHandler DeleteErrorEvent = null;

        public string ErrorString = string.Empty;

        public void DoAbsoluteDeleteFile(object filePath)
        {
            try
            {
                string filename = filePath.ToString();

                if (string.IsNullOrEmpty(filename))
                {
                    return;
                }

                if (File.Exists(filename))
                {
                    File.SetAttributes(filename, FileAttributes.Normal);
                   
                    double sectors = Math.Ceiling(new FileInfo(filename).Length / 512.0);
                   
                    byte[] dummyBuffer = new byte[512];
                   
                    RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
                   
                    FileStream inputStream = new FileStream(filename, FileMode.Open);

                    inputStream.Position = 0;
                   
                    for (int sectorsWritten = 0; sectorsWritten < sectors; sectorsWritten++)
                    {
                        rng.GetBytes(dummyBuffer);

                        inputStream.Write(dummyBuffer, 0, dummyBuffer.Length);

                        sectorsWritten++;
                    }

                    inputStream.SetLength(0);

                    inputStream.Close();
                   
                    DateTime dt = new DateTime(2049, 1, 1, 0, 0, 0);

                    File.SetCreationTime(filename, dt);

                    File.SetLastAccessTime(filename, dt);

                    File.SetLastWriteTime(filename, dt);

                    File.Delete(filename);

                    WipeDone();
                }
            }
            catch (Exception e)
            {
                WipeError(e);
            }
        }

        public void DoDeleteFolder(object folder)
        {
            string folderPath = folder.ToString();

            if (string.IsNullOrEmpty(folderPath))
            {
                return;
            }

            DirectoryInfo direct = new DirectoryInfo(folderPath);

            FileSystemInfo[] filesystem = direct.GetFileSystemInfos();

            if (filesystem == null || filesystem.Length == 0)
            {
                direct.Delete();
            }
            else
            {
                foreach (FileSystemInfo fileItem in filesystem)
                {
                    if (fileItem is FileInfo)
                    {
                        this.DoAbsoluteDeleteFile(fileItem.FullName);
                    }
                    else
                    {
                        DoDeleteFolder(fileItem.FullName);
                    }
                }
            }

            if (this.FinishDeleteFolderEvent != null)
            {
                this.FinishDeleteFolderEvent(this, null);
            }
        }

        private void WipeError(Exception e)
        {
            if (DeleteErrorEvent != null)
            {
                ErrorString = e.Message;

                DeleteErrorEvent(this, null);
            }
        }

        private void WipeDone()
        {
            if (FinishDeleteFileEvent != null)
            {
                FinishDeleteFileEvent(this, null);
            }
        }
    }
}
