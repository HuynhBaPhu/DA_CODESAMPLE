﻿using System;
using System.Collections.Generic;

#nullable disable

namespace CodeSampleAPI.Data
{
    public partial class CtDeKiemTraCode
    {
        public CtDeKiemTraCode()
        {
            CtBaiLamCodes = new HashSet<CtBaiLamCode>();
        }

        public int IddeKiemTra { get; set; }
        public int IdBaiTapCode { get; set; }
        public int? SttcauHoi { get; set; }
        public double? Diem { get; set; }

        public virtual BaiTapCode IdBaiTapCodeNavigation { get; set; }
        public virtual DeKiemTra IddeKiemTraNavigation { get; set; }
        public virtual ICollection<CtBaiLamCode> CtBaiLamCodes { get; set; }
    }
}