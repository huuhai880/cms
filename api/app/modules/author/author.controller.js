const httpStatus = require('http-status');
const authorService = require('./author.service');
const otpService = require('../otp/otp.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const htmlHelper = require('../../common/helpers/html.helper');
const events = require('../../common/events');
const ValidationResponse = require('../../common/responses/validation.response');
const config = require('../../../config/config');
const optionService = require('../../common/services/options.service');

// Get list author
const getListAuthor = async (req, res, next) => {
  try {
    const serviceRes = await authorService.getListAuthor(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

// Create author
const createAuthor = async (req, res, next) => {
  try {
    // Check author name exists
    const authorNameExist = await authorService.findByAuthorName(
      req.body.author_name
    );
    if (authorNameExist) {
      return next(new ValidationResponse('ID Tác giả ', 'đã được sử dụng'));
    }

    // Check email exists
    const emailExist = await authorService.findByEmail(req.body.email);
    if (emailExist) {
      return next(new ValidationResponse('Email', 'đã được sử dụng.'));
    }

    // Check phone number exists
    const phoneExits = await authorService.findByPhone(req.body.phone_number);
    if (phoneExits) {
      return next(new ValidationResponse('Số điện thoại', 'đã được sử dụng.'));
    }

    // Insert Author
    const serviceRes = await authorService.createAuthor(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    // create otp
    const tokenRes = await otpService.createOtp({
      // author_id: serviceRes.getData(),
      author_id: 1,
      email: req.body.email,
    });

    if (tokenRes.isSuccess()) {
      // // Call event send email
      // const { token } = tokenRes.getData();
      events.emit('send-email', {
        to: req.body.email,
        subject: '[SCC] Đăng ký tài khoản tác giả',
        html: htmlHelper.format({
          template: 'register.html',
          mail: {
            name: `${req.body.first_name} ${req.body.last_name}`,
            email: req.body.email,
            password: req.body.password,
            link: config.website,
          },
        }),
      });
    }
    return res.json(
      new SingleResponse(
        serviceRes.getData(),
        RESPONSE_MSG.AUTHOR.CREATE_SUCCESS
      )
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

// Update author
const updateAuthor = async (req, res, next) => {
  try {
    const author_id = req.params.author_id;
    // Check email exists
    const emailExist = await authorService.findByEmail(
      req.body.email,
      author_id
    );
    if (emailExist) {
      return next(new ValidationResponse('Email', 'đã được sử dụng.'));
    }

    // Check phone number exists
    const phoneExits = await authorService.findByPhone(
      req.body.phone_number,
      author_id
    );
    if (phoneExits) {
      return next(new ValidationResponse('Số điện thoại', 'đã được sử dụng.'));
    }

    // Check Author exists
    const serviceResDetail = await authorService.detailAuthor(author_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update Author
    const serviceRes = await authorService.updateAuthor(req.body, author_id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.AUTHOR.UPDATE_SUCCESS)
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

// Delete author
const deleteAuthor = async (req, res, next) => {
  try {
    const author_id = req.params.author_id;
    const auth_name = req.auth.user_name;
    // Check Author exists
    const serviceResDetail = await authorService.detailAuthor(author_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Delete Author
    const serviceRes = await authorService.deleteAuthor(author_id, auth_name);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.AUTHOR.DELETE_SUCCESS)
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

// Detail Author
const detailAuthor = async (req, res, next) => {
  try {
    const author_id = req.params.author_id;

    const serviceRes = await authorService.detailAuthor(author_id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

// Change status author
const changeStatusAuthor = async (req, res, next) => {
  try {
    const author_id = req.params.author_id;
    const auth_name = req.auth.user_name;
    const is_active = apiHelper.getValueFromObject(req.body, 'is_active');
    // Check function exists
    const serviceResDetail = await authorService.detailAuthor(author_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    const serviceRes = await authorService.changeStatusAuthor(
      author_id,
      auth_name,
      is_active
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.AUTHOR.CHANGE_STATUS_SUCCESS)
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

// Change password author
const changePassAuthor = async (req, res, next) => {
  try {
    const author_id = req.params.author_id;

    // Check function exists
    const serviceResDetail = await authorService.detailAuthor(author_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    const serviceRes = await authorService.changePassAuthor(
      author_id,
      req.body
    );
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(
      new SingleResponse(null, RESPONSE_MSG.AUTHOR.CHANGE_PASSWORD_SUCCESS)
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

const generateAuthorName = async (req, res, next) => {
  try {
    // Check author exists
    const user = await authorService.generateAuthorName();
    return res.json(
      new SingleResponse(user, RESPONSE_MSG.AUTHOR.GENERATE_AUTHORNAME_SUCCESS)
    );
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
};

const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('CRM_AUTHOR', req.query);

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  detailAuthor,
  changeStatusAuthor,
  changePassAuthor,
  generateAuthorName,
  getOptions,
};
