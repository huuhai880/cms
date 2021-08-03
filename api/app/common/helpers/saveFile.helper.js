const fileHelper = require('./file.helper');
const uuid = require('uuid');
const logger = require('../classes/logger.class');
const config = require('../../../config/config');

const saveImage = async (savedFolder, base64) => {
  let bannerImage = null;

  try {
    if (fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromBase64(base64);
      const d = new Date();
      const nameFile = uuid.v1();
      bannerImage = await fileHelper.saveBase64(
        savedFolder,
        base64,
        `${nameFile}.${extension}`
      );
    } else {
      bannerImage = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, { function: 'productCategoryService.saveImage' });

    return bannerImage;
  }
  return bannerImage;
};

module.exports = {
  saveImage,
};
