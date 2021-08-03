const httpStatus = require('http-status');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const mailHelper = require('../../common/helpers/mail.helper');

const sendEmail = async (req, res, next) => {
  try {
    const mail = {
          to: 'bynhoang.dev@gmail.com',
          subject: '[SCC] Đăng ký tài khoản tác giả',
          html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
            '<html xmlns="http://www.w3.org/1999/xhtml">\n' +
            '\n' +
            '<head>\n' +
            '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
            '    <title>SCC Mail | Đăng ký tài khoản tác giả</title>\n' +
            '</head>\n' +
            '\n' +
            '<body>\n' +
            '    \n' +
            '<table style="padding: 0; margin: 0; width: 100%; height: 100vh; background-color: EBF2F6; font-family: Arial, Helvetica, sans-serif; border-spacing: 0px !important;">\n' +
            '\t<tr>\n' +
            '\t\t<td style="display: block;">\n' +
            '\t\t\t<table style="width: 100%; max-width: 580px; background: #fff; margin: 30px auto; border: none; padding: 0; border-spacing: 0px">\n' +
            '\t\t\t\t<tr style="background: #fff;">\n' +
            '\t\t\t\t\t<td colspan="2">\n' +
            '\t\t\t\t\t\t<table>\n' +
            '\t\t\t\t\t\t\t<tr>\n' +
            '\t\t\t\t\t\t\t\t<td style="font-size: 17px; padding: 20px 30px;">Xin chào <strong>hoang  binh,</strong></td>\n' +
            '\t\t\t\t\t\t\t</tr>\n' +
            '\t\t\t\t\t\t\t<tr>\n' +
            '\t\t\t\t\t\t\t\t<td style="font-size: 15px; padding: 0 30px;">Bạn đã đăng ký tài khoản mới thành công từ SCC.</strong></td>\n' +
            '\t\t\t\t\t\t\t</tr>\n' +
            '\t\t\t\t\t\t\t<tr>\n' +
            '\t\t\t\t\t\t\t\t<td style="font-size: 17px; padding: 30px 30px 10px 30px;">Thông tin đăng nhập: <br>\n' +
            '\t\t\t\t\t\t\t\t\t<span>Tài khoản đăng nhập: bynhoang.dev@gmail.com</span>\n' +
            '\t\t\t\t\t\t\t\t\t<span>Mật khẩu đăng nhập: qeb01jca</span>\n' +
            '\t\t\t\t\t\t\t\t</td>\n' +
            '\t\t\t\t\t\t\t</tr>\n' +
            '\t\t\t\t\t\t\t<tr>\n' +
            '\t\t\t\t\t\t\t\t<td style="font-size: 15px; padding: 20px 30px 10px 30px;">Vui lòng ấn vào <a href="http://booknet.vn">ĐÂY</a> để đăng nhập.</td>\n' +
            '                            </tr>\n' +
            '\t\t\t\t\t\t\t<tr>\n' +
            '\t\t\t\t\t\t\t\t<td style="font-size: 15px; padding: 20px 30px 10px 30px;">Vui lòng giữ mọi thông tin đăng nhập ở chế độ an toàn.</td>\n' +
            '                            </tr>\n' +
            '                            <tr>\n' +
            '\t\t\t\t\t\t\t\t<td style="font-size: 13px;  font-style: italic; padding: 5px 30px; color: #777;">* Không phản hồi email này. Đây là email được gửi bằng hệ thống tự động</td>\n' +
            '\t\t\t\t\t\t\t</tr>\n' +
            '\t\t\t\t\t\t\t<tr>\n' +
            '\t\t\t\t\t\t\t\t<td style="font-size: 17px; padding: 10px 30px 0px 30px;">\n' +
            '\t\t\t\t\t\t\t\t\tTrân trọng !\n' +
            '\t\t\t\t\t\t\t\t</td>\n' +
            '\t\t\t\t\t\t\t</tr>\n' +
            '\t\t\t\t\t\t\t<tr>\n' +
            '\t\t\t\t\t\t\t\t<td style="font-size: 15px; padding: 5px 30px 20px 30px;">\n' +
            '\t\t\t\t\t\t\t\t\t<b>SCC Team</b>\n' +
            '\t\t\t\t\t\t\t\t</td>\n' +
            '\t\t\t\t\t\t\t</tr>\n' +
            '\t\t\t\t\t\t</table>\n' +
            '\t\t\t\t\t</td>\n' +
            '\t\t\t\t</tr>\n' +
            '\t\t\t</table>\n' +
            '\t\t</td>\n' +
            '\t</tr>\n' +
            '</table>\n' +
            '</body>\n' +
            '\n' +
            '</html>'
        
      }
    await mailHelper.send(mail);
    return res.json('ok');
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


module.exports = {
  sendEmail
};
