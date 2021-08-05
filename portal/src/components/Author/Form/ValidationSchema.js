import * as Yup from "yup";
export default Yup.object().shape({
    author_name: Yup.string().trim()
      .required("ID nhân viên là bắt buộc."),
    password: authorEnt ? undefined : Yup.string().trim()
      .min(8, 'Mật khẩu quá ngắn, ít nhất 8 ký tự!')
      .max(25, 'Mật khẩu quá dài, tối đa 25 ký tự!')
      .required("Mật khẩu là bắt buộc."),
    gender: Yup.string()
      .required("Giới tính là bắt buộc."),
    email: Yup.string().trim()
      .email('Email không hợp lệ')
      .required("Email là bắt buộc."),
    birthday: Yup.date().typeError("Ngày sinh không hợp lệ.")
      .required("Ngày sinh là bắt buộc."),
    first_name: Yup.string().trim().matches(/^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]+$/, 'Họ không chứa kí tự đặc biệt.')
      .required("Họ là bắt buộc."),
    last_name: Yup.string().trim().matches(/^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]+$/, 'Tên không chứa kí tự đặc biệt.')
      .required("Tên là bắt buộc."),
    country_id: Yup.string()
      .required("Quốc gia là bắt buộc."),
    province_id: Yup.string()
      .required("Tỉnh/Thành phố là bắt buộc."),
    district_id: Yup.string()
      .required("Quận/Huyện là bắt buộc."),
    ward_id: Yup.string()
      .required("Phường/Xã là bắt buộc."),
    address: Yup.string().trim().matches(/^[a-zA-Z0-9\s\/_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ/-]+$/, 'Địa chỉ cụ thể không chứa kí tự đặc biệt.')
      .required("Địa chỉ cụ thể là bắt buộc."),
    phone_number: Yup.string().trim()
      .matches(/^\d{10,11}$/, 'Điện thoại không hợp lệ!')
      .required("Điện thoại là bắt buộc."),
});