using Microsoft.VisualBasic.Devices;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Management;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Update
{
    public partial class About : Form
    {
        string title = ConfigurationManager.AppSettings["Title"].Trim();//配置文件
        string CopyrightYear = ConfigurationManager.AppSettings["CopyrightYear"].Trim();//配置文件
        public About()
        {
            this.StartPosition = FormStartPosition.CenterScreen; //窗口居中
            InitializeComponent();
        }

        private void About_Load(object sender, EventArgs e)
        {
            this.TopMost = true;
            addListHead();
            ComputerInfo computer = new ComputerInfo();
            this.Text = "关于 " + title;
            this.label16.Text = title;
            this.label15.Text = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString();
            this.label14.Text = System.Net.Dns.GetHostName();
            this.label13.Text = getNC();
            this.label12.Text = getCPU();
            this.label10.Text = getDisk();
            this.label11.Text = computer.OSFullName;
            this.label1.Text = Environment.CurrentDirectory;
            this.label17.Text = $"Copyright © {CopyrightYear} Shenyang Accurate Technology Co., Ltd.";
            getIP();
        }

        private void getIP()
        {
            int count = 0;
            try
            { 
                foreach (NetworkInterface netInt in NetworkInterface.GetAllNetworkInterfaces())
                {
                    count++;
                    UnicastIPAddressInformation[] ipIntProp = netInt.GetIPProperties().UnicastAddresses.ToArray<UnicastIPAddressInformation>();
                    ListViewItem lvi = new ListViewItem();
                    lvi.Text = count.ToString();
                    lvi.SubItems.Add(netInt.Name);
                    lvi.SubItems.Add(InsertFormat(netInt.GetPhysicalAddress().ToString(), 2, "-"));
                    lvi.SubItems.Add(ipIntProp[1].Address.ToString());
                    this.listView1.Items.Add(lvi);
                }
            }
            catch
            { 
            }
        }

        private void addListHead()
        {
            this.listView1.Columns.Clear();
            this.listView1.Columns.Add("序号", 38, HorizontalAlignment.Left);
            this.listView1.Columns.Add("名称", 157, HorizontalAlignment.Left);
            this.listView1.Columns.Add("MAC地址", 120, HorizontalAlignment.Left);
            this.listView1.Columns.Add("IP地址", 110, HorizontalAlignment.Left);
        }

        public static string InsertFormat(string input, int interval, string value)
        {
            for (int i = interval; i < input.Length; i += interval + 1)
            {
                input = input.Insert(i, value);
            }
            return input;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private string getCPU()
        {
            string CPUName = "";
            ManagementObjectSearcher mos = new ManagementObjectSearcher("Select * from Win32_Processor");//Win32_Processor  CPU处理器
            foreach (ManagementObject mo in mos.Get())
            {
                CPUName = mo["Name"].ToString();
            }
            mos.Dispose();
            return CPUName;
        }

        private string getNC()
        {
            ManagementClass m = new ManagementClass("Win32_PhysicalMemory");//内存条
            ManagementObjectCollection mn = m.GetInstances();
            double count = 0;
            foreach (ManagementObject mo1 in mn)
            {
                double capacity = ((Math.Round(Int64.Parse(mo1.Properties["Capacity"].Value.ToString()) / 1024 / 1024 / 1024.0, 1)));
                count += capacity;
            }
            mn.Dispose();
            m.Dispose();
            return count.ToString() + "G";
        }

        private string getDisk()
        {
            ManagementClass m = new ManagementClass("win32_DiskDrive");//硬盘
            ManagementObjectCollection mn = m.GetInstances();
            string str = "";
            foreach (ManagementObject mo1 in mn)
            {
                double capacity = Int64.Parse(mo1.Properties["Size"].Value.ToString()) / 1024 / 1024 / 1024;
                string one = capacity + "G";
                str += one + "  ";
            }
            mn.Dispose();
            m.Dispose();
            return str;
        }

        private void listView1_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (listView1.SelectedIndices.Count > 0)         //若有选中项 
            {
                listView1.SelectedItems[0].Selected = false;
            }
        }
    }
}
