const uploadFileService = require('./upload-file.service');
const SingleResponse = require('../../common/responses/single.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const uploadFile = async (req, res, next) => {
  try {
    const base64 = req.body.base64;
    const folder = req.body.folder;
    const includeCdn = req.body.includeCdn;
    const serviceRes = await uploadFileService.saveFile(base64,folder, includeCdn);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    if(serviceRes.getData()==='')
    {
      return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.UPLOADFILE.e));
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.UPLOADFILE.CREATE_ERROR));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  uploadFile,
};
