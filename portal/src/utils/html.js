// import moment from 'moment'
import _ from "lodash";
/**
 * Set layout app full width/height
 * @return void
 */
export function layoutFullWidthHeight(flag) {
  flag = typeof flag === "boolean" ? flag : true;
  let html = document.querySelector("html");
  if (flag) {
    if (html.className.indexOf("full-wh") < 0) {
      html.className += " full-wh";
    }
  } else {
    html.className.replace("full-wh", "");
  }
}

/**
 * @see https://www.radzen.com/blog/read-image-base64-blazor-signalr/
 */
//
const readAsDataURL = (fileInput, opts) => {
  const all = [];
  for (let i = 0; i < fileInput.files.length; i++) {
    let file0 = fileInput.files[i];
    all.push(
      new Promise((resolve, reject) => {
        // const file0 = fileInput.files[0];
        // console.log('file0: ', file0);
        // Validate
        if (typeof opts.validate === "function") {
          let result = opts.validate(file0);
          if (result) {
            return reject(new Error(result));
          }
        }
        //.end
        const reader = new FileReader();
        reader.onerror = () => {
          reader.abort();
          reject(new Error("Error reading file."));
        };
        reader.addEventListener(
          "load",
          () => {
            let { result } = reader;
            Object.assign(result, { _file: file0 });
            resolve(result);
          },
          false
        );
        reader.readAsDataURL(file0);
      })
    );
  }
  return Promise.all(all);
};
//
export function readFileAsBase64(fileInput, _opts) {
  // Format options
  let opts = Object.assign({}, _opts);
  return readAsDataURL(fileInput, opts);
}

/**
 * ReadURL/ Convert Base64 Image
 * @param {File} file
 * @return {Object}
 */
export function readImageBase64CallBack(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); // eslint-disable-line no-undef
    reader.onload = (e) => resolve({ data: { link: e.target.result } });
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/**
 * Post/ Upload Image To CDN
 * @param {File} file
 * @return {Object}
 */
export function uploadImageCallBack(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
    xhr.open("POST", "https://api.imgur.com/3/image");
    xhr.setRequestHeader("Authorization", "Client-ID 8d26ccd12712fca");
    const data = new FormData(); // eslint-disable-line no-undef
    data.append("image", file);
    xhr.send(data);
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.responseText);
      resolve(response);
    });
    xhr.addEventListener("error", () => {
      const error = JSON.parse(xhr.responseText);
      reject(error);
    });
  });
}

/**
 * Get/convert
 * @param {File} file
 * @return {Object}
 */
export function fileToObj(file) {
  return {
    name: file.name,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    size: file.size,
    type: file.type,
    isImage: /^image/.test("image/png"),
  };
}

/**
 * Map data options
 * @param {Array} data
 * @return {Array}
 */
export function mapDataOptions4Select(data, valueName = "value", labelName = "label") {
  if (!data || !data.length) return [];
  return (data || []).map((_item) => {
    let item = { ..._item };
    let { id, name, label, value } = item;
    label = name || item[labelName];
    value = id || item[valueName];
    return { ..._item, label, value };
  });
}

// @var {String}
const CDN = process.env.REACT_APP_CDN || "";
/**
 * Get path with prefix of project's cdn
 * @param {String} path
 * @return {String}
 */
export function cdnPath(path) {
  let _p = "";
  path = (path || "").replace(/\\/g, "/");
  if (path.match(/^\w+:/)) {
    _p = path;
  } else {
    _p = (path ? `${CDN}/${path || ""}` : "").replace(/\/{3,}/g, "/");
  }
  return _p;
} // window._cdnPath = cdnPath;

// @var {String}
export const MOMENT_FORMAT_DATE = "DD/MM/YYYY";
// @var {String}
export const MOMENT_FORMAT_DATETIME = "DD/MM/YYYY hh:mm:ss";
// @var {String}
export const MOMENT_FORMAT_TIME = "hh:mm:ss";

/**
 *
 * @param {String} str
 * @return {String}
 */
export function stringToAlias(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/ /g, "_");
}

/**
 * General format form data
 * @param {Object} data
 * @return {Object}
 */
export function formatFormData(data) {
  let newData = {};
  if ("object" === typeof data) {
    Object.keys(data).forEach((key) => {
      if ("primaryKey" === key) {
        return;
      }
      if (key.indexOf("__") === 0) {
        return;
      }
      let val = data[key];
      if (true === val) {
        val = 1;
      }
      if (false === val) {
        val = 0;
      }
      newData[key] = val;
    });
  }
  return newData;
}

/**
 *
 * @param {String} value
 * @return {number}
 */
export function formatTimeHour(parseNumber) {
  if (parseNumber) {
    const stringNumber = parseNumber.toString();
    return stringNumber.length === 3
      ? `0${stringNumber.slice(0, 1)}:${stringNumber.slice(1, 3)}`
      : `${stringNumber.slice(0, 2)}:${stringNumber.slice(2, 4)}`;
  }
  return null;
}

/**
 *
 * @param {String} value
 * @return {number}
 */
export function validateInputNumber(value, config = {}) {
  const parseNumber = value.replace(/\D/g, "");
  if (Object.keys(config).length) {
    if (config.formatTimeHour) {
      const stringNumber = parseNumber.toString();
      if (1 * stringNumber.slice(0, 2) > 23) {
        return 1 * stringNumber.slice(0, 1);
      }
      if (1 * stringNumber.slice(2) > 5 && stringNumber.length === 3) {
        return 1 * stringNumber.slice(0, 2);
      }
      return parseNumber.length > 2
        ? `${stringNumber.slice(0, 2)}:${stringNumber.slice(2, 4)}`
        : parseNumber;
    }
  }
  return parseNumber;
}

/**
 *
 * @param {Object} data
 * @return {Object}
 */
export function groupByParams(source, key) {
  const sortObj = _.sortBy(source, [
    function (o) {
      return !_.isNil(o[key]);
    },
  ]);
  let cloneData = JSON.parse(JSON.stringify(sortObj));
  let data = [];

  // Filter parent Object
  for (let i = 0; i <= _.size(sortObj); i++) {
    if (!!sortObj[i]) break;
    if (!_.isNil(sortObj[i][key])) {
      break;
    }
    data.push({
      parent_id: sortObj[i].id,
      label: _.isUndefined(sortObj[i][key]) ? "" : sortObj[i].label,
      options: _.isUndefined(sortObj[i][key]) ? [] : [sortObj[i]],
    });
    cloneData.shift();
  }

  function recursionLoop(source, outputArray) {
    if (_.isEmpty(source)) return;
    _.forEach(source, function (session, i) {
      _.forEach(outputArray, function (obj, index) {
        const findIndex = _.findIndex(obj.options, function (o) {
          return o.id === session[key];
        });
        if (findIndex !== -1) {
          outputArray[index].options.splice(findIndex + 1, 0, session);
          outputArray[index].options[findIndex + 1].is_child_options =
            findIndex;
        }
      });
    });
  }
  recursionLoop(cloneData, data);

  return data;
}

/**
 *
 * @param {Object} data
 * @return {Object}
 */
export function mappingDisabled(arr, data, key) {
  const cloneData = JSON.parse(JSON.stringify(data));
  arr.map((v) => {
    let currentIdx = data.findIndex((_item) => _item.value === 1 * v[key]);
    if (currentIdx >= 0) {
      cloneData[currentIdx].isDisabled = true;
    }
  });
  return cloneData;
}

/**
 * Helper print
 * @see https://www.w3schools.com/jsref/met_win_open.asp
 * @return void
 */
export function printWindow(url, _specs = {}, name = "_blank") {
  // Get. format input
  let specs = Object.assign(
    {
      directories: "0",
      fullscreen: "0",
      width: "960",
      height: "960",
      left: "10",
      top: "10",
      location: "1",
      menubar: "0",
      resizable: "1",
      scrollbars: "1",
      status: "0",
      titlebar: "0",
      toolbar: "0",
    },
    _specs
  );
  specs = Object.keys(specs)
    .map((prop) => {
      return `${prop}=${specs[prop]}`;
    })
    .join(",");

  let win = printWindow._win;
  if (win) {
    win.close();
  }
  printWindow._win = window.open(url, name, specs);
}


export const readImageAsBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const validateDimession = (file, max_width = 0, max_height = 0) => {
  return new Promise((resolve) => {
    let img = new Image()
    img.src = window.URL.createObjectURL(file)
    img.onload = () => {
      if (img.width < max_width) return resolve(false)
      if (img.width < max_height) return resolve(false)
      return resolve(true)
    }
    img.onerror = () => resolve(false)
  })
}

export function changeToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  //Đổi ký tự có dấu thành không dấu
  str = str.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  str = str.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  str = str.replace(/đ/gi, 'd');

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
  // console.log(str)
  return str;
}

export const convertValue = (value, options) => {
  if (!(typeof value === "object") && options && options.length) {
    value = ((_val) => {
      return options.find((item) => "" + item.value === "" + _val);
    })(value);
  } else if (Array.isArray(value) && options && options.length) {
    return options.filter((item) => {
      return value.find((e) => e == item.value);
    });
  }
  return value;
};

export function formatPhoneNumber(phoneNumberString) {
  try {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return phoneNumberString;

  } catch (error) {
    return phoneNumberString;
  }
}
