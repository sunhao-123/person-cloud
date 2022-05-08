using ICSharpCode.SharpZipLib.Zip;
using Microsoft.VisualBasic.Devices;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Windows.Forms;
using Update;

namespace WinShowDown
{
    public partial class FrmMain : Form
    {
        string serverurl = ConfigurationManager.AppSettings["url"].Trim();//配置文件
        string appName = ConfigurationManager.AppSettings["appName"].Trim();//配置文件
        string ua = ConfigurationManager.AppSettings["ua"].Trim();//配置文件
        string getVersionApi = ConfigurationManager.AppSettings["getVersionApi"].Trim();//配置文件
        string getModeApi = ConfigurationManager.AppSettings["getModeApi"].Trim();//配置文件
        string getAllVersionApi = ConfigurationManager.AppSettings["getAllVersionApi"].Trim();//配置文件
        string downloadApi = ConfigurationManager.AppSettings["downloadApi"].Trim();//配置文件
        string title = ConfigurationManager.AppSettings["Title"].Trim();//配置文件
        private Thread dfileThread = null;
        public string updateMode = "";
        public delegate void DefaulEventDelegate(object sender, EventArgs e);
        public FrmMain()
        {
            this.StartPosition = FormStartPosition.CenterScreen; //窗口居中
            InitializeComponent();
            this.label2.Text = title;
            this.Text = title;
            this.TopMost = true;
        }
        private void button1_Click(object sender, EventArgs e)
        {
            this.button1.Enabled = false;
            this.comboBox1.Enabled = false;
            if (CloseApp())
            {
                Version serverV = new Version(this.comboBox1.SelectedItem.ToString().Split('-')[0]);
                Version localV = new Version(this.label6.Text);
                if (localV < serverV)
                {
                    string[] str = this.comboBox1.SelectedItem.ToString().Split('-');
                    string version = str[0];
                    string mode = str[1];
                    updateMode = mode;
                    string url = $"{serverurl}{downloadApi}?version={version}&mode={mode}";
                    DownloadFile(url, $@"temp.{mode}", this.progressBar1, this.label7);
                }
                else
                {
                    if (MessageBox.Show("选择版本等于或低于当前软件版本，是否继续？", "信息提示", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
                    {
                        string[] str = this.comboBox1.SelectedItem.ToString().Split('-');
                        string version = str[0];
                        string mode = str[1];
                        updateMode = mode;
                        string url = $"{serverurl}{downloadApi}?version={version}&mode={mode}";
                        DownloadFile(url, $@"temp.{mode}", this.progressBar1, this.label7);
                    }
                    else
                    {
                        this.button1.Enabled = true;
                        this.comboBox1.Enabled = true;
                    }
                }
            }
            else
            {
                MessageBox.Show("关闭主程序进程失败！更新停止！", "信息提示", MessageBoxButtons.OK, MessageBoxIcon.Error);
                this.button1.Enabled = true;
                this.comboBox1.Enabled = true;
            }
        }

        private bool CloseApp()
        {
            Process[] MyProcess = Process.GetProcessesByName(appName);
            try
            {
                for (int i = 0; i < MyProcess.Length; i++)
                {
                    MyProcess[i].EnableRaisingEvents = false;
                    try
                    {
                        MyProcess[i].Kill();
                    }
                    catch
                    {
                        return false;
                    }
                }
                return true;
            }
            catch
            {
                return true;
            }
        }


        /// <summary>
        /// c#,.net 下载文件
        /// </summary>
        /// <param name="URL">下载文件地址</param>
        /// <param name="Filename">下载后的存放地址</param>
        /// <param name="Prog">用于显示的进度条</param>
        /// 
        public void DownloadFile(string URL, string filename, System.Windows.Forms.ProgressBar prog, System.Windows.Forms.Label label1)        
        {
            float percent = 0;
            System.Net.HttpWebRequest Myrq = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(URL);
            //System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3;
            System.Net.HttpWebResponse myrp = (System.Net.HttpWebResponse)Myrq.GetResponse();
            long totalBytes = myrp.ContentLength;
            if (prog != null)                
            {
                prog.Maximum = (int) totalBytes;
            }
            System.IO.Stream st = myrp.GetResponseStream();
            System.IO.Stream so = new System.IO.FileStream(filename, System.IO.FileMode.Create);
            long totalDownloadedByte = 0;
            byte[] by = new byte[1024];
            int osize = st.Read(by, 0, (int)by.Length);
            while (osize > 0)                
            {
                totalDownloadedByte = osize + totalDownloadedByte;
                System.Windows.Forms.Application.DoEvents();
                so.Write(by, 0, osize);
                if (prog != null)
                {
                    prog.Value = (int) totalDownloadedByte;
                }
                osize = st.Read(by, 0, (int)by.Length);
                percent = (float)totalDownloadedByte / (float)totalBytes * 100;
                double num = Math.Round(percent, 2);
                label1.Text = "文件下载进度" + num.ToString() + "%";
                if (percent.ToString() == "100")
                {
                    if (updateMode == "exe")
                    {
                        label1.Text = "文件下载完成，正在替换中......";
                    }
                    else if (updateMode == "zip")
                    {
                        label1.Text = "文件下载完成，正在解压中......";
                    }
                    
                }
                System.Windows.Forms.Application.DoEvents();
                //必须加注这句代码，否则label1将因为循环执行太快而来不及显示信息
            }
            so.Close();
            st.Close();
            //MessageBox.Show("更新文件下载完成");
            if (updateMode == "exe")
            {
                replaceFile();
            }
            else if (updateMode == "zip")
            {
                replaceFile1($"./{appName}.exe");
                UnZip(@"temp.zip", @"./", null);
            }
        }

        private void replaceFile()
        {
            AbsoluteFile dfile = new AbsoluteFile();
            dfile.DeleteErrorEvent += new EventHandler(Dfile_DeleteErrorEvent);
            dfile.FinishDeleteFileEvent += new EventHandler(Dfile_FinishDeleteFileEvent);
            dfileThread = new Thread(new ParameterizedThreadStart(dfile.DoAbsoluteDeleteFile));
            dfileThread.IsBackground = true;
            dfileThread.Start(appName + ".exe");
        }

        private void replaceFile1(string file)
        {
            AbsoluteFile dfile = new AbsoluteFile();
            dfile.DeleteErrorEvent += new EventHandler(Dfile_DeleteErrorEvent);
            dfile.FinishDeleteFileEvent += new EventHandler(Dfile_FinishDeleteFileEvent1);
            dfileThread = new Thread(new ParameterizedThreadStart(dfile.DoAbsoluteDeleteFile));
            dfileThread.IsBackground = true;
            dfileThread.Start(file);
            //File.Delete(file);
        }

        void Dfile_FinishDeleteFileEvent(object sender, EventArgs e)
        {
            if (!this.InvokeRequired)
            {
                //MessageBox.Show("删除完毕！");
                Computer MyComputer = new Computer();
                MyComputer.FileSystem.RenameFile("temp.exe", appName + ".exe");
                MessageBox.Show("程序更新完成！", "信息提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                System.Diagnostics.ProcessStartInfo myStartInfo = new System.Diagnostics.ProcessStartInfo();
                myStartInfo.FileName = appName + ".exe";
                System.Diagnostics.Process myProcess = new System.Diagnostics.Process();
                myProcess.StartInfo = myStartInfo;
                myProcess.Start();
                System.Environment.Exit(0);
            }
            else
            {
                this.BeginInvoke(new DefaulEventDelegate(Dfile_FinishDeleteFileEvent), new object[] { sender, e });
            }
        }

        void Dfile_FinishDeleteFileEvent1(object sender, EventArgs e)
        {
            if (!this.InvokeRequired)
            {
                //MessageBox.Show("删除完毕！");
            }
            else
            {
                this.BeginInvoke(new DefaulEventDelegate(Dfile_FinishDeleteFileEvent1), new object[] { sender, e });
            }
        }


        void Dfile_DeleteErrorEvent(object sender, EventArgs e)
        {
            if (!this.InvokeRequired)
            {
                MessageBox.Show((sender as AbsoluteFile).ErrorString, "信息提示", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            else
            {
                this.BeginInvoke(new DefaulEventDelegate(Dfile_DeleteErrorEvent), new object[] { sender, e });
            }
        }

        private string getLocalVersion()
        {
            return System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString();
        }

        /// <summary>
        /// 指定Url地址使用 Get 方式获取全部字符串
        /// </summary>
        /// <param name="url">请求链接地址</param>
        /// <returns></returns>
        private string Get(string url)//get接口方法
        {
            try
            {
                string result = "";
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                req.UserAgent = $"({GetOsVersion()};) {ua}/{getLocalVersion()}";
                HttpWebResponse resp = (HttpWebResponse)req.GetResponse();
                Stream stream = resp.GetResponseStream();
                try
                {
                    //获取内容
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        result = reader.ReadToEnd();
                    }
                }
                finally
                {
                    stream.Close();
                }
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return ex.Message;
            }

        }

        public string GetOsVersion()//获取电脑信息
        {
            List<string> lineList = cmd("VER");
            string[] os = lineList[0].Split(' ');
            string osname = os[0] + " " + os[1];
            string osver = os[os.Length - 1].Replace('[', ' ').Replace(']', ' ').Trim();
            return osname + " NT " + osver;
        }

        private List<string> cmd(string cmd)//获取电脑信息
        {
            cmd = cmd.Trim().TrimEnd('&') + "&exit";//说明：不管命令是否成功均执行exit命令，否则当调用ReadToEnd()方法时，会处于假死状态
            using (Process p = new Process())
            {
                p.StartInfo.FileName = "cmd.exe";
                p.StartInfo.UseShellExecute = false;        //是否使用操作系统shell启动
                p.StartInfo.RedirectStandardInput = true;   //接受来自调用程序的输入信息
                p.StartInfo.RedirectStandardOutput = true;  //由调用程序获取输出信息
                p.StartInfo.StandardOutputEncoding = Encoding.UTF8;// 指定编码
                p.StartInfo.RedirectStandardError = true;   //重定向标准错误输出
                p.StartInfo.CreateNoWindow = true;          //不显示程序窗口
                p.Start();//启动程序
                          //向cmd窗口写入命令
                p.StandardInput.WriteLine(cmd);
                p.StandardInput.AutoFlush = true;
                //获取cmd窗口的输出信息
                StreamReader reader = p.StandardOutput;//截取输出流
                List<string> lineList = new List<string>();
                while (!reader.EndOfStream)
                {
                    string line = reader.ReadLine();
                    lineList.Add(line);
                }
                p.WaitForExit();//等待程序执行完退出进程
                p.Close();
                return lineList;
            }
        }

        private void FrmMain_Load(object sender, EventArgs e)
        {
            //http://192.168.1.102:8081/update/getVersion
            try
            {
                FileVersionInfo fileVerInfo = System.Diagnostics.FileVersionInfo.GetVersionInfo(appName + ".exe");
                this.label6.Text = String.Format("{0}.{1}.{2}.{3}", fileVerInfo.FileMajorPart, fileVerInfo.FileMinorPart, fileVerInfo.FileBuildPart, fileVerInfo.FilePrivatePart);
            }
            catch
            {
                MessageBox.Show("未找到主程序！", "信息提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                this.label6.Text = "0.0.0.0";
            }
            this.label5.Text = Get($"{serverurl}{getVersionApi}");
            string version = this.label5.Text;
            //http://192.168.1.102:8081/update/getMode?version=6.6.6.6
            updateMode = Get($"{serverurl}{getModeApi}{version}");
            addCombobox();
        }

        private void addCombobox()
        {
            //http://127.0.0.1:8081/update/getAllVersion
            string allVer = Get($"{serverurl}{getAllVersionApi}");
            string[] verArr = allVer.Split(',');
            for (int i = 0; i < verArr.Length; i++)
            {
                this.comboBox1.Items.Add(verArr[i]);
                this.comboBox1.SelectedIndex = i;
            }
            //this.comboBox1.SelectedIndex = jsonArr.Count();
        }

        /// <summary>
        /// ZIP:解压一个zip文件
        /// </summary>
        /// <param name="ZipFile">需要解压的Zip文件（绝对路径）</param>
        /// <param name="TargetDirectory">解压到的目录</param>
        /// <param name="Password">解压密码</param>
        /// <param name="OverWrite">是否覆盖已存在的文件</param>
        public void UnZip(string ZipFile, string TargetDirectory, string Password, bool OverWrite = true)
        {

            //目录结尾
            if (!TargetDirectory.EndsWith("\\")) { TargetDirectory += "\\"; }
            //如果解压到的目录不存在，则创建
            if (!Directory.Exists(TargetDirectory))
            {
                Directory.CreateDirectory(TargetDirectory);
            }

            using (ZipInputStream zipfiles = new ZipInputStream(File.OpenRead(ZipFile)))
            {
                zipfiles.Password = Password;
                ZipEntry theEntry;

                while ((theEntry = zipfiles.GetNextEntry()) != null)
                {
                    string directoryName = "";
                    string pathToZip = "";
                    pathToZip = theEntry.Name;

                    if (pathToZip != "")
                        directoryName = Path.GetDirectoryName(pathToZip) + "\\";

                    string fileName = Path.GetFileName(pathToZip);

                    Directory.CreateDirectory(TargetDirectory + directoryName);

                    if (fileName != "")
                    {
                        if ((File.Exists(TargetDirectory + directoryName + fileName) && OverWrite) || (!File.Exists(TargetDirectory + directoryName + fileName)))
                        {
                            using (FileStream streamWriter = File.Create(TargetDirectory + directoryName + fileName))
                            {
                                int size = 2048;
                                byte[] data = new byte[2048];
                                while (true)
                                {
                                    size = zipfiles.Read(data, 0, data.Length);

                                    if (size > 0)
                                        streamWriter.Write(data, 0, size);
                                    else
                                        break;
                                }
                                streamWriter.Close();
                            }
                        }
                    }
                }
                zipfiles.Close();
            }
            Thread.Sleep(3000);
            replaceFile1(@"./temp.zip");
            MessageBox.Show("程序更新完成！", "信息提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
            System.Diagnostics.ProcessStartInfo myStartInfo = new System.Diagnostics.ProcessStartInfo();
            myStartInfo.FileName = appName + ".exe";
            System.Diagnostics.Process myProcess = new System.Diagnostics.Process();
            myProcess.StartInfo = myStartInfo;
            myProcess.Start();
            System.Environment.Exit(0);
        }

        private void 检查更新ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.comboBox1.SelectedIndex = -1;
            this.comboBox1.Items.Clear();
            this.comboBox1.Text = "";
            FrmMain_Load(sender, e);
            MessageBox.Show("检查完成！", "信息提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void 退出ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void FrmMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (MessageBox.Show("是否要退出更新程序？", "信息提示", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.No)
            {
                e.Cancel = true;
            }
            else
            {
                e.Cancel = false;
                System.Environment.Exit(0);
            }
        }

        private void 关于ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            About about = new About();
            about.ShowDialog();
        }
    }
}
