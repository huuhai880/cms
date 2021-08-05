import React from "react";
import { Button } from "reactstrap";
import { CheckAccess } from "@navigation/VerifyAccess";

import { fnDelete } from "@utils/api";

const RowAction = ({
  data,
  tableMeta,
  fieldName,
  editPermission = "",
  deletePermission = "",
  detailLink = "",
  editLink = "",
  deleteLink = "",
  updateData,
}) => {
  const handleActionItemClick = (type, id, rowIndex) => {
    let routes = {
      detail: detailLink,
      edit: editLink,
      delete: deleteLink,
    };
    const route = routes[type];
    if (type.match(/detail|edit|changePassword/i)) {
      window._$g.rdr(`${route}${id}`);
    } else {
      window._$g.dialogs.prompt(
        "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
        "Xóa",
        (confirm) => {
          if (!confirm) return;
          fnDelete({ url: `${route}${id}` })
            .then(() => {
              const cloneData = JSON.parse(JSON.stringify(data));
              cloneData.splice(rowIndex, 1);
              updateData(cloneData);
            })
            .catch((e) => {
              window._$g.dialogs.alert(
                window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
              );
            });
        }
      );
    }
  };

  return (
    <div className="text-center">
      {detailLink && (
        <Button
        color="warning"
        title="Chi tiết"
        className="mr-1"
        onClick={() =>
          handleActionItemClick(
            "detail",
            data[tableMeta["rowIndex"]][fieldName],
            tableMeta["rowIndex"]
          )
        }
        >
          <i className="fa fa-info" />
        </Button>
      )}
      
      <CheckAccess permission={editPermission}>
        <Button
          color="primary"
          title="Chỉnh sửa"
          className="mr-1"
          onClick={() =>
            handleActionItemClick(
              "edit",
              data[tableMeta["rowIndex"]][fieldName],
              tableMeta["rowIndex"]
            )
          }
        >
          <i className="fa fa-edit" />
        </Button>
      </CheckAccess>

      <CheckAccess permission={deletePermission}>
        <Button
          color="danger"
          title="Xóa"
          className=""
          onClick={() =>
            handleActionItemClick(
              "delete",
              data[tableMeta["rowIndex"]][fieldName],
              tableMeta["rowIndex"]
            )
          }
        >
          <i className="fa fa-trash" />
        </Button>
      </CheckAccess>
    </div>
  );
};

export default RowAction;
