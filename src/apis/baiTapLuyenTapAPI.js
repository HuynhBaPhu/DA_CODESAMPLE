import axiosClient from "./axiosClient";

const BaiTapLuyenTapAPI = {
  getAll: (pageNumber, pageSize) => {
    const url = `BTLuyenTap/getAll?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return axiosClient.get(url);
  },
  getAllByAdmin: () => {
    const url = "BTLuyenTap/getAllByAdmin";
    return axiosClient.get(url);
  },
  count: () => {
    const url = "BTLuyenTap/countAll";
    return axiosClient.get(url);
  },
  getOne: (params) => {
    const url = `BTLuyenTap/getOne?id=${params}`;
    return axiosClient.get(url, { params });
  },
  add: (btLuyenTapAndTestCases) => {
    const url = "BTLuyenTap/add";
    return axiosClient.post(url, btLuyenTapAndTestCases);
  },
  DeleteBTLT: (id) => {
    const url = `BTLuyenTap/DeleteBTLT?id=${id}`;
    return axiosClient.delete(url, { id });
  },
  EditBTLT: (
    id,
    doKho,
    tieuDe,
    deBai,
    rangBuoc,
    dinhDangDauVao,
    dinhDangDauRa,
    mauDauVao,
    mauDauRa,
    tag
  ) => {
    const url = `BTLuyenTap/EditBTLT?id=${id}&doKho=${doKho}&tieuDe=${tieuDe}&deBai=${deBai}&rangBuoc=${rangBuoc}&dinhDangDauVao=${dinhDangDauVao}&dinhDangDauRa=${dinhDangDauRa}&mauDauVao=${mauDauVao}&mauDauRa=${mauDauRa}&tag=${tag}`;
    console.log("API" + doKho);
    return axiosClient.put(
      url,
      { id },
      { doKho },
      { tieuDe },
      { deBai },
      { rangBuoc },
      { dinhDangDauVao },
      { dinhDangDauRa },
      { mauDauVao },
      { mauDauRa },
      { tag }
    );
  },
  SubmitBT: (valueSubmit) => {
    const url = `BTLuyenTap/SubmitBTCode`;
    return axiosClient.post(url, valueSubmit);
  },
  getBaiTapDaLam: (uId) => {
    const url = `BTLuyenTap/getBaiTapDaLam?uId=${uId}`;
    return axiosClient.get(url, { uId });
  },
  getAllOver: () => {
    const url = "BTLuyenTap/getAllOverView";
    return axiosClient.get(url);
  },
  getLichSuLamBai: (uId, id) => {
    const url = `BTLuyenTap/getLichSuLamBai?uId=${uId}&id=${id}`;
    return axiosClient.get(url, { uId }, { id });
  },
};

export default BaiTapLuyenTapAPI;
