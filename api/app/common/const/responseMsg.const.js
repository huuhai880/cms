module.exports = {
  NOT_FOUND: 'Requested resource not found.',
  VALIDATION_FAILED: 'Invalid request params.',
  REQUEST_SUCCESS: 'Request successfully!',
  REQUEST_FAILED: 'Something went wrong, please try again later.',
  AUTH: {
    EMAIL: {
      AVAILABLE: 'Email is available!',
      UNAVAILABLE: 'Email is not available.',
      FAIL_TO_SELECT: 'Having issue using selected email.',
    },
    LOGIN: {
      SUCCESS: 'Logged in successfully!',
      FAILED: 'Tên đăng nhập hoặc Mật khẩu đã nhập sai.',
      INACTIVE_USER: 'User account is inactive.',
      REFRESH_TOKEN_FAILED: 'Failed to request new session.',
      UNAUTHORIZED: 'Token invalid.',
      TOKEN_REQUIRED: 'Token is required.',
    },
    LOGOUT: {
      SUCCESS: 'Logged out successfully!',
    },
    CHANGE_PASSWORD: {
      SUCCESS: 'Password updated successfully!',
      FAILED: 'Failed to update password.',
    },
    FORGOT_PASSWORD: {
      INVALID_EMAIL: 'Account not found.',
      SUCCESS: 'Your request has successfully!',
      FAILED: 'Failed to forgot password.',
    },
  },
  PROFILE: {
    UPDATE_SUCCESS: 'Profile updated successfully!',
    UPDATE_FAILED: 'Failed to update profile.',
  },
  CRUD: {
    CREATE_SUCCESS: 'Create data successfully.',
    CREATE_FAILED: 'Create data failed.',
    UPDATE_SUCCESS: 'Update data successfully.',
    UPDATE_FAILED: 'Update data failed.',
    DELETE_SUCCESS: 'Delete data successfully.',
  },
  USER: {
    VERIFICATION_SUCCESS: 'Account verification successfully!',
    VERIFICATION_FAILED: 'Account verification failed.',
    CREATE_SUCCESS: 'Create user success.',
    CREATE_FAILED: 'Create user failed.',
    UPDATE_SUCCESS: 'Update user success.',
    UPDATE_FAILED: 'Update user failed.',
    DELETE_SUCCESS: 'Delete user success.',
    UPDATE_PASSWORD_SUCCESS: 'Update password success.',
    GENERATE_USERNAME_SUCCESS: 'Generate username success.',
    OLD_PASSWORD_WRONG: 'Mật khẩu cũ không chính xác.',
    CHECK_EMAIL: 'Email đã tồn tại.',
  },
  USER_GROUP: {
    CREATE_SUCCESS: 'Create user group success.',
    CREATE_FAILED: 'Create user group failed.',
    UPDATE_SUCCESS: 'Update user group success.',
    UPDATE_FAILED: 'Update user group failed.',
    DELETE_SUCCESS: 'Delete user group success.',
    CHANGE_STATUS_SUCCESS: 'Change status user group success.',
    CHECK_NAME_FAILED: 'Tên nhóm người dùng đã tồn tại.',
  },
  USERGROUP_FUNCTION: {
    SAVE_SYS_USERGROUP_FUNCTION_SUCCESS:
      'Save SYS_USERGROUP_FUNCTION is success',
    SAVE_SYS_USERGROUP_FUNCTION_FAILED: 'Save SYS_USERGROUP_FUNCTION is failed',
    DELETE_SYS_USERGROUP_FUNCTION_FAILED:
      'Delete SYS_USERGROUP_FUNCTION is failed',
  },
  FUNCTION: {
    CREATE_SUCCESS: 'Create function success.',
    CREATE_FAILED: 'Create function failed.',
    UPDATE_SUCCESS: 'Update function success.',
    UPDATE_FAILED: 'Update function failed.',
    DELETE_SUCCESS: 'Delete function success.',
    CHANGE_STATUS_SUCCESS: 'Change status function success.',
    CHECK_ALIAS_FAILED: 'Mã hiệu quyền đã tồn tại.',
    CHECK_NAME_FAILED: 'Tên quyền đã tồn tại.',
  },
  FUNCTIONGROUP: {
    CREATE_SUCCESS: 'Create function group success.',
    CREATE_FAILED: 'Create function group failed.',
    UPDATE_SUCCESS: 'Update function group success.',
    UPDATE_FAILED: 'Update function group failed.',
    DELETE_SUCCESS: 'Delete function group success.',
    CHANGE_STATUS_SUCCESS: 'Change status function group success.',
    CHECK_NAME_FAILED: 'Tên nhóm quyền đã tồn tại.',
  },
  MENU: {
    CREATE_SUCCESS: 'Create menu success.',
    CREATE_FAILED: 'Create menu failed.',
    UPDATE_SUCCESS: 'Update menu success.',
    UPDATE_FAILED: 'Update menu failed.',
    DELETE_SUCCESS: 'Delete menu success.',
    CHANGE_STATUS_SUCCESS: 'Change status menu success.',
  },
  COMPANY: {
    CREATE_SUCCESS: 'Create company success.',
    CREATE_FAILED: 'Create company failed.',
    UPDATE_SUCCESS: 'Update company success.',
    UPDATE_FAILED: 'Update company failed.',
    DELETE_SUCCESS: 'Delete company success.',
    DELETE_FAILED: 'Delete company failed.',
    CHANGE_STATUS_SUCCESS: 'Change status company success.',
    CHECK_NAME: 'Tên công ty đã tồn tại.',
    CHECK_PHONE: 'Số điện thoại công ty đã tồn tại.',
    CHECK_EMAIL: 'Email công ty đã tồn tại.',
  },

  AMBUSINESSTYPE: {
    CREATE_SUCCESS: 'Create business type success.',
    CREATE_FAILED: 'Create business type failed.',
    UPDATE_SUCCESS: 'Update business type success.',
    UPDATE_FAILED: 'Update business type failed.',
    DELETE_SUCCESS: 'Delete business type success.',
    CHANGE_STATUS_SUCCESS: 'Change status business type success.',
    CHECK_NAME_FAILED: 'Tên loại cơ sở đã tồn tại.',
  },

  AMBUSINESS: {
    CREATE_SUCCESS: 'Create business success.',
    CREATE_FAILED: 'Create business failed.',
    UPDATE_SUCCESS: 'Update business success.',
    UPDATE_FAILED: 'Update business failed.',
    DELETE_SUCCESS: 'Delete business success.',
    CHANGE_STATUS_SUCCESS: 'Change status business success.',
  },

  CAMPAIGNSTATUS: {
    CREATE_SUCCESS: 'Create campaign status success.',
    CREATE_FAILED: 'Create campaign status failed.',
    UPDATE_SUCCESS: 'Update campaign status success.',
    UPDATE_FAILED: 'Update campaign status failed.',
    DELETE_SUCCESS: 'Delete campaign status success.',
    CHANGE_STATUS_SUCCESS: 'Change status campaign status success.',
    CHECK_NAME_FAILED: 'Tên trạng thái chiến dịch đã tồn tại.',
  },
  CAMPAIGNTYPE: {
    CREATE_SUCCESS: 'Create campaign type success.',
    CREATE_FAILED: 'Create campaign type failed.',
    CREATE_CAMPTYPE_RELEVEL_FAILED: 'Create campaign type review level failed.',
    UPDATE_SUCCESS: 'Update campaign type success.',
    UPDATE_FAILED: 'Update campaign type failed.',
    DELETE_SUCCESS: 'Delete campaign type success.',
    DELETE_CAMPTYPE_RELEVEL_FAILED: 'Delete campaign type review level failed.',
    CHANGE_STATUS_SUCCESS: 'Change status campaign type success.',
    DELETE_FAILED: 'Delete campaign type is failed',
  },

  CAMPAIGN: {
    CREATE_FAILED: 'Create campaign group failed.',
    CREATE_SUCCESS: 'Create campaign success.',
    UPDATED_FAILED_CAMPAIGN_APPROVED:
      'Campaign can not update because Campaign was approved.',
    DELETE_FAILED_CAMPAIGN_APPROVED:
      'Chiến dich không thể xóa vì đã được duyệt.',
    DELETE_FAILED: 'Delete campaign is failed',
    DELETE_SUCCESS: 'Delete campaign success.',
  },

  CAMPAIGNREVIEWLIST: {
    DELETE_FAILED: 'Delete campaign review list is failed',
    CREATE_FAILED: 'Create campaign review list failed.',
    APPROVED_SUCCESS: 'Approved success.',
    APPROVED_FAILED: 'Approved failed.',
    DOUBLE_USER_REVIEW: 'Double user review.',
  },
  SEGMENT: {
    CREATE_SUCCESS: 'Create segment success.',
    CREATE_FAILED: 'Create segment failed.',
    UPDATE_SUCCESS: 'Update segment success.',
    UPDATE_FAILED: 'Update segment failed.',
    DELETE_SUCCESS: 'Delete segment success.',
    CHANGE_STATUS_SUCCESS: 'Change status segment success.',
    CHECK_NAME_FAILED: 'Tên phân khúc đã tồn tại.',
  },
  STATUSDATALEADS: {
    CREATE_SUCCESS: 'Create status dataleads success.',
    CREATE_FAILED: 'Create status dataleads failed.',
    UPDATE_SUCCESS: 'Update status dataleads success.',
    UPDATE_FAILED: 'Update status dataleads failed.',
    DELETE_SUCCESS: 'Delete status dataleads success.',
    CHANGE_STATUS_SUCCESS: 'Change status status dataleads success.',
  },
  AREA: {
    CREATE_SUCCESS: 'Create area success.',
    CREATE_FAILED: 'Create area failed.',
    UPDATE_SUCCESS: 'Update area success.',
    UPDATE_FAILED: 'Update area failed.',
    DELETE_SUCCESS: 'Delete area success.',
    CHANGE_STATUS_SUCCESS: 'Change status area success.',
  },
  STORE: {
    CREATE_SUCCESS: 'Create store success.',
    CREATE_FAILED: 'Create store failed.',
    UPDATE_SUCCESS: 'Update store success.',
    UPDATE_FAILED: 'Update store failed.',
    DELETE_SUCCESS: 'Delete store success.',
    CHANGE_STATUS_SUCCESS: 'Change status store success.',
  },
  DEPARTMENT: {
    CREATE_SUCCESS: 'Create department success.',
    CREATE_FAILED: 'Create department failed.',
    UPDATE_SUCCESS: 'Update department success.',
    UPDATE_FAILED: 'Update department failed.',
    DELETE_SUCCESS: 'Delete department success.',
    CHANGE_STATUS_SUCCESS: 'Change status department success.',
  },
  MANUFACTURER: {
    CREATE_SUCCESS: 'Create manufacturer success.',
    CREATE_FAILED: 'Create manufacturer failed.',
    UPDATE_SUCCESS: 'Update manufacturer success.',
    UPDATE_FAILED: 'Update manufacturer failed.',
    DELETE_SUCCESS: 'Delete manufacturer success.',
    CHANGE_STATUS_SUCCESS: 'Change status manufacturer success.',
    CHECK_NAME_FAILED: 'Tên nhà sản xuất đã tồn tại.',
  },
  TASKWORKFOLLOW: {
    CREATE_SUCCESS: 'Create task work follow success.',
    CREATE_FAILED: 'Create task work follow failed.',
    UPDATE_SUCCESS: 'Update task work follow success.',
    UPDATE_FAILED: 'Update task work follow failed.',
    DELETE_SUCCESS: 'Delete task work follow success.',
    CHANGE_STATUS_SUCCESS: 'Change status task work follow success.',
  },
  TASKTYPE: {
    CREATE_SUCCESS: 'Create task type success.',
    CREATE_FAILED: 'Create task type failed.',
    UPDATE_SUCCESS: 'Update task type success.',
    UPDATE_FAILED: 'Update task type failed.',
    DELETE_SUCCESS: 'Delete task type success.',
    DELETE_FAILED: 'Delete task type failed.',
    CHANGE_STATUS_SUCCESS: 'Change status task type success.',
  },
  BUSINESSUSER: {
    CREATE_SUCCESS: 'Create business user success.',
    CREATE_FAILED: 'Create business user failed.',
    UPDATE_SUCCESS: 'Update business user success.',
    UPDATE_FAILED: 'Update business user failed.',
    DELETE_SUCCESS: 'Delete business user success.',
    CHANGE_STATUS_SUCCESS: 'Change status business user success.',
  },
  TASK: {
    CREATE_SUCCESS: 'Thêm mới công việc thành công.',
    CREATE_FAILED: 'Thêm mới công việc thất bại.',
    UPDATE_SUCCESS: 'Cập nhật công việc thành công.',
    UPDATE_FAILED: 'Cập nhật công việc thất bại.',
    DELETE_SUCCESS: 'Xóa công việc thành công.',
    DELETE_FAILED: 'Xóa công việc thất bại.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái công việc thành công.',
  },
  DATALEADSCOMMENT: {
    CREATE_SUCCESS: 'Thêm mới bình luận thành công.',
    CREATE_FAILED: 'Thêm mới bình luận thất bại.',
    UPDATE_SUCCESS: 'Cập nhật bình luận thành công.',
    UPDATE_FAILED: 'Cập nhật bình luận thất bại.',
    DELETE_SUCCESS: 'Xóa bình luận thành công.',
    DELETE_FAILED: 'Xóa bình luận thất bại.',
  },
  FILEATTACTMENT: {
    UPLOAD_FAILED: 'Lưu đính kèm thất bại.',
    CREATE_SUCCESS: 'Thêm mới đính kèm thành công.',
    CREATE_FAILED: 'Thêm mới đính kèm thất bại.',
    UPDATE_SUCCESS: 'Cập nhật đính kèm thành công.',
    UPDATE_FAILED: 'Cập nhật đính kèm thất bại.',
    DELETE_SUCCESS: 'Xóa đính kèm thành công.',
    DELETE_FAILED: 'Xóa đính kèm thất bại.',
  },
  HISTORYDATALEADS: {
    CREATE_SUCCESS: 'Thêm mới lịch sử thành công.',
    CREATE_FAILED: 'Thêm mới lịch sử thất bại.',
    UPDATE_SUCCESS: 'Cập nhật lịch sử thành công.',
    UPDATE_FAILED: 'Cập nhật lịch sử thất bại.',
    DELETE_SUCCESS: 'Xóa lịch sử thành công.',
    DELETE_FAILED: 'Xóa lịch sử thất bại.',
  },
  DATALEADSMEETING: {
    CREATE_SUCCESS: 'Thêm mới cuộc hẹn thành công.',
    CREATE_FAILED: 'Thêm mới cuộc hẹn thất bại.',
    UPDATE_SUCCESS: 'Cập nhật cuộc hẹn thành công.',
    UPDATE_FAILED: 'Cập nhật cuộc hẹn thất bại.',
    DELETE_SUCCESS: 'Xóa cuộc hẹn thành công.',
    DELETE_FAILED: 'Xóa cuộc hẹn thất bại.',
  },
  CRM_CUSTOMERDATALEADS: {
    CREATE_FAILED: 'Create customer data leads failed.',
    CREATE_SUCCESS: 'Create customer data leads success.',
    DELETE_FAILED: 'Delete customer data leads is failed',
    DELETE_SUCCESS: 'Delete customer data leads success.',
    CHECK_IDCARD_FAILED: 'Chứng minh nhân dân đã tồn tại.',
    CHECK_PHONE_FAILED: 'Số điện thoại đã tồn tại.',
  },
  CRM_CUSCAMPAIGN: {
    CREATE_FAILED: 'Create customer campaign failed.',
    DELETE_FAILED: 'Delete customer campaign is failed',
  },
  CRM_SEG_DATALEADS: {
    CREATE_FAILED: 'Create seg data leads failed.',
    DELETE_FAILED: 'Delete seg data leads is failed',
  },
  DATALEADSSMS: {
    CREATE_SUCCESS: 'Thêm mới SMS thành công.',
    CREATE_FAILED: 'Thêm mới SMS thất bại.',
    UPDATE_SUCCESS: 'Cập nhật SMS thành công.',
    UPDATE_FAILED: 'Cập nhật SMS thành công.',
    DELETE_SUCCESS: 'Xóa SMS thành công.',
    DELETE_FAILED: 'Xóa SMS thành công.',
  },
  DATALEADSCALL: {
    CREATE_SUCCESS: 'Thêm mới cuộc gọi thành công.',
    CREATE_FAILED: 'Thêm mới cuộc gọi thất bại.',
    UPDATE_SUCCESS: 'Cập nhật cuộc gọi thành công.',
    UPDATE_FAILED: 'Cập nhật cuộc gọi thành công.',
    DELETE_SUCCESS: 'Xóa cuộc gọi thành công.',
    DELETE_FAILED: 'Xóa cuộc gọi thành công.',
  },
  TASKDATALEADS: {
    CHANGE_WORKFLOW_SUCCESS: 'Thay đổi bước xử lý thành công.',
    CHANGE_WORKFLOW_FAILED: 'Cập nhật bước xử lý thất bại.',
  },
  SENDSMS: {
    SENDSMS_SUCCESS: 'Gửi tin nhắn thành công.',
    SENDSMS_FAILED: 'Gửi tin nhắn thất bại',
    SENDSMS_CHECKCONNECTION_FAILED: 'Kết nối SMS thất bại.',
    SENDSMS_GETBRANDNAME_FAILED: 'Lấy danh sách Brandname lỗi.',
    SENDSMS_GETSERVICETYPELIST_FAILED: 'Lấy danh sách loại dịch vụ lỗi.',
  },
  DATALEADSMAIL: {
    CREATE_SUCCESS: 'Thêm mới mail thành công.',
    CREATE_FAILED: 'Thêm mới mail thất bại.',
    UPDATE_SUCCESS: 'Cập nhật mail thành công.',
    UPDATE_FAILED: 'Cập nhật mail thất bại.',
    DELETE_SUCCESS: 'Xóa mail thành công.',
    DELETE_FAILED: 'Xóa mail thất bại.',
  },
  PRODUCTCATEGORY: {
    CREATE_SUCCESS: 'Thêm mới danh mục sản phẩm thành công.',
    CREATE_FAILED: 'Thêm mới danh mục sản phẩm thất bại.',
    UPDATE_SUCCESS: 'Cập nhật danh mục sản phẩm thành công.',
    UPDATE_FAILED: 'Cập nhật danh mục sản phẩm thất bại.',
    DELETE_SUCCESS: 'Xóa danh mục sản phẩm thành công.',
    DELETE_FAILED: 'Xóa danh mục sản phẩm thất bại.',
    SAVEIMG_FAILED: 'Lỗi tải hình ảnh.',
  },
  PRODUCT: {
    CREATE_SUCCESS: 'Thêm mới sản phẩm thành công.',
    CREATE_FAILED: 'Thêm mới sản phẩm thất bại.',
    UPDATE_SUCCESS: 'Cập nhật sản phẩm thành công.',
    UPDATE_FAILED: 'Cập nhật sản phẩm thất bại.',
    DELETE_SUCCESS: 'Xóa sản phẩm thành công.',
    DELETE_FAILED: 'Xóa sản phẩm thất bại.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái sản phẩm thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái sản phẩm thất bại.',
    CHECK_CODE_FAILED: 'Mã sản phẩm đã tồn tại.',
  },
  PRODUCTATTRIBUTE: {
    CREATE_SUCCESS: 'Thêm mới thuộc tính sản phẩm thành công.',
    CREATE_FAILED: 'Thêm mới thuộc tính sản phẩm thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thuộc tính sản phẩm thành công.',
    UPDATE_FAILED: 'Cập nhật thuộc tính sản phẩm thất bại.',
    DELETE_SUCCESS: 'Xóa thuộc tính sản phẩm thành công.',
    DELETE_FAILED: 'Xóa thuộc tính sản phẩm thất bại.',
    CHANGE_STATUS_SUCCESS:
      'Thay đổi trạng thái thuộc tính sản phẩm thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thuộc tính sản phẩm thất bại.',
  },
  SL_PRICES: {
    CREATE_FAILED: 'Create price failed.',
    UPDATE_FAILED: 'Cập nhật lỗi!.',
    CREATE_SUCCESS: 'Create price success.',
    DELETE_FAILED: 'Delete price is failed',
    DELETE_SUCCESS: 'Delete price success.',
    CHANGE_STATUS_SUCCESS: 'Change status price success.',
    APPROVE_SUCCESS: 'Duyệt giá thành công.',
    APPROVE_EXITST: 'Giá đã được duyệt.',
    APPROVE_NOTEXITST: 'Mức duyệt không tồn tại.',
    APPROVE_UNNOW: 'Lỗi không xác định.',
    CHECK_TRUNG:
      'Không được phép làm giá đồng thời: hình thức xuất, khu vực, cơ sở, thời gian áp dụng',
  },
  PROMOTION: {
    CREATE_SUCCESS: 'Thêm mới khuyến mãi thành công.',
    CREATE_FAILED: 'Thêm mới khuyến mãi thất bại.',
    UPDATE_SUCCESS: 'Cập nhật khuyến mãi thành công.',
    UPDATE_FAILED: 'Cập nhật khuyến mãi thất bại.',
    DELETE_SUCCESS: 'Xóa khuyến mãi thành công.',
    DELETE_FAILED: 'Xóa khuyến mãi thất bại.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái khuyến mãi thành công.',
    APPROVE_SUCCESS: 'Duyệt khuyến mãi thành công.',
  },
  PROMOTIONOFFER: {
    CREATE_SUCCESS: 'Thêm mới ưu đãi thành công.',
    CREATE_FAILED: 'Thêm mới ưu đãi thất bại.',
    UPDATE_SUCCESS: 'Cập nhật ưu đãi mãi thành công.',
    UPDATE_FAILED: 'Cập nhật ưu đãi thất bại.',
    DELETE_SUCCESS: 'Xóa ưu đãi thành công.',
    DELETE_FAILED: 'Xóa ưu đãi thất bại.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái ưu đãi thành công.',
    APPROVE_SUCCESS: 'Duyệt ưu đãi thành công.',
  },
  CUSTOMERTYPE: {
    CREATE_SUCCESS: 'Thêm mới loại khách hàng thành công.',
    CREATE_FAILED: 'Thêm mới loại khách hàng thất bại.',
    UPDATE_SUCCESS: 'Cập nhật loại khách hàng thành công.',
    UPDATE_FAILED: 'Cập nhật loại khách hàng thất bại.',
    DELETE_SUCCESS: 'Xóa loại khách hàng thành công.',
    DELETE_FAILED: 'Xóa loại khách hàng thất bại.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái loại khách hàng thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái loại khách hàng thất bại.',
    CHECK_USED_FAILED: 'Loại khách hàng đã được sử dụng',
  },
  OUTPUTTYPE: {
    CREATE_SUCCESS: 'Thêm mới hình thức xuất thành công.',
    CREATE_FAILED: 'Thêm mới hình thức xuất thất bại.',
    UPDATE_SUCCESS: 'Cập nhật hình thức xuất thành công.',
    UPDATE_FAILED: 'Cập nhật hình thức xuất thất bại.',
    DELETE_SUCCESS: 'Xóa hình thức xuất thành công.',
    DELETE_FAILED: 'Xóa hình thức xuất thất bại.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái hình thức xuất thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái hình thức xuất thất bại.',
  },
  STATICCONTENT: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_TITLE: 'Tiêu đề đã tồn tại.',
    EXISTS_SEONAME: 'Đường dẫn đã tồn tại.',
    EXISTS_SYSTEMNAME: 'System name đã tồn tại.',
    EXISTS_METATITLE: 'MetaTitle đã tồn tại.',
    EXISTS_METAKEYWORD: 'MataKeyword đã tồn tại.',
  },
  NEWSCATEGORY: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_NAME: 'Tên chuyên mục đã tồn tại.',
    SAVEIMG_FAILED: 'Lỗi tải hình ảnh.',
    EXISTS_ORDERINDEX: 'Thứ tự hiển thị đã tồn tại.',
    EXISTS_PARENT:
      'Vui lòng xóa danh mục cấp con trước khi xóa danh mục cấp cha.',
  },
  TOPIC: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_NAME: 'Tên chủ đề đã tồn tại.',
  },
  SUPPORT: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
  },
  UPLOADFILE: {
    CREATE_SUCCESS: 'Upload tập tin thành công.',
    CREATE_ERROR: 'Upload tập tin thất bại.',
  },
  ACCOUNT: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    CHECK_USENAME_FAILED: 'Tên tài khoản đã được sử dụng',
    CHANGE_PASSWORD_SUCCESS: 'Thay đổi mật khẩu thành công.',
    CHANGE_PASSWORD_FAILED: 'Thay đổi mật khẩu thất bại.',
  },
  RECRUIT: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
  },
  BANNERTYPE: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_PARENT:
      'Vui lòng xóa danh mục cấp con trước khi xóa danh mục cấp cha.',
  },
  BANNER: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
  },
  NEWSSTATUS: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_NAME: 'Tiêu đề đã tồn tại.',
    EXISTS_ORDERINDEX: 'Thứ tự hiển thị đã tồn tại.',
  },
  NEWS: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_NAME: 'Tiêu đề đã tồn tại.',
    UPLOAD_FAILED: 'Lưu ảnh thất bại.',
    EXISTS_TAG: 'Tag đã tồn tại.',
    EXISTS_METAKEYWORD: 'MataKeyword đã tồn tại.',
  },
  WEBSITECATEGORY: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_PARENT:
      'Vui lòng xóa danh mục cấp con trước khi xóa danh mục cấp cha.',
    EXISTS_NAME: 'Tên danh mục đã tồn tại.',
  },
  CANDIDATE: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
  },
  BOOKING: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
  },
  MEMBERSHIP: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
  },
  SETUPSERVICEREGISTER: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_PARENT:
      'Vui lòng xóa danh mục cấp con trước khi xóa danh mục cấp cha.',
  },
  COMMENT: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_PARENT:
      'Vui lòng xóa danh mục cấp con trước khi xóa danh mục cấp cha.',
  },
  CONTRACTTYPE: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Chỉnh sửa thành công.',
    UPDATE_FAILED: 'Chỉnh sửa thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
  },
  CONTRACT: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Chỉnh sửa thành công.',
    UPDATE_FAILED: 'Chỉnh sửa thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    DELETE_FAILED: 'Xóa thất bại.',
    APPROVED_SUCCESS: 'Duyệt thành công.',
    APPROVED_FAILED: 'Duyệt thất bại.',
    TRANSFER_SUCCESS: 'Chuyển nhượng thành công.',
    TRANSFER_FAILED: 'Chuyển nhượng thất bại.',
    FREEZE_SUCCESS: 'Bảo lưu thành công.',
    FREEZE_FAILED: 'Bảo lưu thất bại.',
  },
  HR_USER_TIMEKEEPING: {
    NOT_FOUND: 'Thông tin không tồn tại',
    APPROVED_SUCCESS: 'Duyệt thông tin thành công',
  },
  SETUPSERVICE: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_PARENT:
      'Vui lòng xóa danh mục cấp con trước khi xóa danh mục cấp cha.',
    UPLOAD_FAILED: 'Lưu ảnh thất bại.',
    EXISTS_METATITLE: 'MetaTitle đã tồn tại.',
    EXISTS_METAKEYWORD: 'MataKeyword đã tồn tại.',
  },
  AUTHOR: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    CHECK_USENAME_FAILED: 'Tên tài khoản đã được sử dụng',
    CHANGE_PASSWORD_SUCCESS: 'Thay đổi mật khẩu thành công.',
    CHANGE_PASSWORD_FAILED: 'Thay đổi mật khẩu thất bại.',
    GENERATE_AUTHORNAME_SUCCESS: 'Generate authorname success.',
  },
  PLANCATEGORY: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_NAME: 'Tên chuyên mục đã tồn tại.',
    SAVEIMG_FAILED: 'Lỗi tải hình ảnh.',
    EXISTS_ORDERINDEX: 'Thứ tự hiển thị đã tồn tại.',
    EXISTS_PARENT:
      'Vui lòng xóa danh mục cấp con trước khi xóa danh mục cấp cha.',
  },
  PLAN: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_NAME: 'Tên chuyên mục đã tồn tại.',
    SAVEIMG_FAILED: 'Lỗi tải hình ảnh.',
    EXISTS_ORDERINDEX: 'Thứ tự hiển thị đã tồn tại.',
    EXISTS_PARENT:
      'Vui lòng xóa danh mục cấp con trước khi xóa danh mục cấp cha.',
  },
  PARTNER: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_PARTNER_NAME: 'Tên công ty đã tồn tại.',
    EXISTS_USER_NAME: 'Tài khoản đã tồn tại.',
    EXISTS_PHONE_NUMBER: 'Số điện thoại đối tác đã tồn tại.',
    SAVEIMG_FAILED: 'Lỗi tải hình ảnh.',
  },
  REVIEW: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    CHANGE_STATUS_SUCCESS: 'Thay đổi trạng thái thành công.',
    CHANGE_STATUS_FAILED: 'Thay đổi trạng thái thất bại.',
    EXISTS_PARTNER_NAME: 'Tên công ty đã tồn tại.',
    EXISTS_USER_NAME: 'Tài khoản đã tồn tại.',
    EXISTS_PHONE_NUMBER: 'Số điện thoại đối tác đã tồn tại.',
    SAVEIMG_FAILED: 'Lỗi tải hình ảnh.',
  },

  ATTRIBUTES: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    SAVEIMG_FAILED: 'Lỗi tải hình ảnh.',
    EXISTS_NAME: 'Tên thuộc tính đã tồn tại.',
  },

  CALCULATION: {
    CREATE_SUCCESS: 'Thêm mới thành công.',
    CREATE_FAILED: 'Thêm mới thất bại.',
    UPDATE_SUCCESS: 'Cập nhật thành công.',
    UPDATE_FAILED: 'Cập nhật thất bại.',
    DELETE_SUCCESS: 'Xóa thành công.',
    SAVEIMG_FAILED: 'Lỗi tải hình ảnh.',
    EXISTS_NAME: 'Tên phép tính đã tồn tại.',
  },
};
