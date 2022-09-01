﻿using CodeSampleAPI.Data;
using CodeSampleAPI.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeSampleAPI.Service
{
    public interface IBaiLamKiemTraService
    {
        bool add(BaiLamKiemTraCustom bailamkiemtra);

        List<TongQuanBaiLamKiemTra> getTongQuanByIdDeKiemTra(int id);

        List<CT_BaiLamKiemTra> getChiTietByIdBaiLamKiemTra(int id);

    }
    public class BaiLamKiemTraService:IBaiLamKiemTraService
    {
        private readonly CodeSampleContext _codeSampleContext;
        public BaiLamKiemTraService(CodeSampleContext codeSampleContext)
        {
            this._codeSampleContext = codeSampleContext;
        }

        public bool add(BaiLamKiemTraCustom baiLamKiemTraCustom)
        {
            List<CauTraLoi> lsCauTraLoi = baiLamKiemTraCustom.lsCauTraLoi;
            try
            {
                BaiLamKiemTra baiLamKiemTra = new BaiLamKiemTra()
                {
                    TongDiem = baiLamKiemTraCustom.tongDiem,
                    IddeKiemTra = baiLamKiemTraCustom.idDeKiemTra,
                    NgayLam = DateTime.Now,
                    IdnguoiDung = baiLamKiemTraCustom.uId
                };
                _codeSampleContext.BaiLamKiemTras.Add(baiLamKiemTra);
                _codeSampleContext.SaveChanges();

                foreach (var cauTraLoi in lsCauTraLoi)
                {
                    if (cauTraLoi.loaiCauHoi == 0)
                    {
                        CtBaiLamTracNghiem ctBaiLamTracNghiem = new CtBaiLamTracNghiem()
                        {
                            IdbaiLam = baiLamKiemTra.IdbaiLamKiemTra,
                            IdbaiTapTracNghiem = cauTraLoi.id,
                            IddeKiemTra = baiLamKiemTraCustom.idDeKiemTra,
                            DiemDatDuoc = cauTraLoi.diem,
                            DapAn = int.Parse(cauTraLoi.dapAn)
                        };
                        _codeSampleContext.CtBaiLamTracNghiems.Add(ctBaiLamTracNghiem);
                    }
                    else
                    {
                        CtBaiLamCode ctBaiLamCode = new CtBaiLamCode()
                        {
                            IdbaiLam = baiLamKiemTra.IdbaiLamKiemTra,
                            IdbaiTapCode = cauTraLoi.id,
                            IddeKiemTra = baiLamKiemTraCustom.idDeKiemTra,
                            DiemDatDuoc = cauTraLoi.diem,
                            Code = cauTraLoi.dapAn
                        };
                        _codeSampleContext.CtBaiLamCodes.Add(ctBaiLamCode);
                    }
                }
                _codeSampleContext.SaveChanges();
            }
            catch (Exception e)
            {
                string error = e.ToString();
                return false;
            }

            return true;
        }
        public List<TongQuanBaiLamKiemTra> getTongQuanByIdDeKiemTra(int id)
        {
            var res = (from blKT in _codeSampleContext.BaiLamKiemTras
                       where blKT.IddeKiemTra == id
                       select new TongQuanBaiLamKiemTra()
                       {
                           diem = blKT.TongDiem,
                           hoTen = blKT.IdnguoiDungNavigation.HoTen,
                           tenHienThi = blKT.IdnguoiDungNavigation.TenHienThi,
                           thoiGianNop = blKT.NgayLam,
                           uid = blKT.IdnguoiDung,
                           idBaiLam = blKT.IdbaiLamKiemTra
                       }).ToList();
            int i = 0;
            foreach (var item in res)
            {
                item.id = i++;
            }
            return res;
        }

        public List<CT_BaiLamKiemTra> getChiTietByIdBaiLamKiemTra(int id)
        {
            List<CT_BaiLamKiemTra> lsTracNghiem = (from tn in _codeSampleContext.CtBaiLamTracNghiems
                                                   where tn.IdbaiLam == id
                                                   select new CT_BaiLamKiemTra()
                                                   {
                                                       cauHoi = tn.Id.IdBaiTapTracNghiemNavigation.CauHoi,
                                                       stt = tn.Id.SttCauHoi,
                                                       dapAn = tn.DapAn.ToString(),
                                                       loaiCauHoi = 0,
                                                       diemDatDuoc = tn.DiemDatDuoc,
                                                       diemToiDa = tn.Id.Diem
                                                   }).ToList();
            List<CT_BaiLamKiemTra> lsCode = (from code in _codeSampleContext.CtBaiLamCodes
                                             where code.IdbaiLam == id
                                             select new CT_BaiLamKiemTra()
                                             {
                                                 cauHoi = code.Id.IdBaiTapCodeNavigation.TieuDe,
                                                 stt = code.Id.SttcauHoi,
                                                 dapAn = code.Code,
                                                 loaiCauHoi = 1,
                                                 diemDatDuoc = code.DiemDatDuoc,
                                                 diemToiDa = code.Id.Diem
                                             }).ToList();
            var lsUnion = lsTracNghiem.Union(lsCode).OrderBy(p => p.stt).ToList();
            return lsUnion;
        }
    }
}
