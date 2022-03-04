const fs = require('fs');
const mkdirp = require('mkdirp-promise');
const appRoot = require('app-root-path');
const logger = require('../classes/logger.class');
const path = require('path');
const folderUploadName = 'uploads';
const base64 = require('is-base64');
const FormData = require('form-data');
const config = require('../../../config/config');
const axios = require('axios');

const readFileAsString = (path) => {
    try {
        return fs.readFileSync(path, { encoding: 'utf8' });
    } catch (e) {
        logger.error(e, { 'function': 'fileHelper.readFileAsString' });
    }
    return '';
};


const uploadFormData = (base64) => {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('type', 'default');
        form.append('file', Buffer.from(base64.split(';base64,').pop(), 'base64'), { filename: 'document.png' })
        axios.post(`${config.domain_cdn}/upload`, form, { headers: { ...form.getHeaders(), ...{ 'Authorization': `APIKEY ${config.upload_apikey}` } } })
            .then(res => resolve(res.data))
            .catch(reject)
    })
}


const saveTmpBase64File = (pathFile, base64) => {
    try {
        const base64data = base64.split(';base64,').pop();
        fs.writeFileSync(pathFile, base64data, { encoding: 'base64' });

        return pathFile;
    } catch (e) {
        return null;
    }
};

const getPathStorage = () => {
    return `${appRoot}/storage`;
};

const getPathUpload = () => {
    return getPathStorage() + `/${folderUploadName}`;
};

/**
 * Save base64 to file
 *
 * @param folderPath
 * @param base64
 * @param fileName
 * @returns {Promise<*>}
 */
const saveBase64 = async (folderPath, base64, fileName) => {
    try {
        // let pathFolder = getPathUpload() + `/${folderPath}`;
        // pathFolder = path.normalize(pathFolder);

        // // Check folder exists
        // if (!fs.existsSync(pathFolder)) {
        //   await mkdirp(pathFolder);
        // }

        // let pathFile = `${pathFolder}/${fileName}`;
        // pathFile = path.normalize(pathFile);

        // // save file
        // saveTmpBase64File(pathFile, base64);

        // return path.normalize(`/${folderUploadName}/${folderPath}/${fileName}`);

        const res = await uploadFormData(base64);
        return res.data && res.data.file ? res.data.file : null

    } catch (e) {
        // console.log(e)
        // logger.error(e, { 'function': 'fileHelper.saveBase64' });
        return null;
    }
};

const getExtensionFromBase64 = (base64, extentions) => {
    if (!extentions || extentions.length === 0)
        extentions = ['.jpeg', '.jpg', '.png', '.gif', '.xls', '.xlsx', '.ods', '.mp3', '.mp4', '.doc', '.docx', '.odt', '.pdf', '.txt', '.ppt', '.pptx'];
    const extention = base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64'));
    if (extentions.includes('.' + extention))
        return extention;
    return null;
};

function isBase64(strBase64) {
    return base64(strBase64, { allowEmpty: false, allowMime: true });
}

const getExtensionFromFileName = (fileName, extentions) => {
    if (!extentions || extentions.length === 0)
        extentions = ['.jpeg', '.jpg', '.png', '.gif', '.xls', '.xlsx', '.ods', '.mp3', '.mp4', '.doc', '.docx', '.odt', '.pdf', '.txt', '.ppt', '.pptx'];
    var arrName = fileName.split('.');
    const extention = arrName.length > 1 ? arrName[arrName.length - 1] : '';
    if (extentions.includes('.' + extention))
        return extention;
    return null;
};

function isImageBase64(data) {
    if (!data) return false;
    return (data.indexOf('data:image/jpg;base64') != -1 ||
        data.indexOf('data:image/png;base64') != -1 ||
        data.indexOf('data:image/jpeg;base64') != -1);
}

module.exports = {
    readFileAsString,
    saveBase64,
    getExtensionFromBase64,
    isBase64,
    getExtensionFromFileName,
    isImageBase64
};
