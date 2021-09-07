import React from "react";
import Select from "react-select";

function SelectProductCategory({
  name,
  onChange,
  placeHolder = "-- Chọn --",
  portalTarget = "body",
  isClearable = false,
  defaultValue = null,
  isDisabled = false,
  id = null,
  listOption,
  className,
  isTarget = true,
}) {

    
  const formatTreeList = (data) => {
    if (data && data.length) {
      const getCategoryTree = (parent_id = 0, prefix = "#", arr = []) => {
        let child = data.filter((x) => x.parent_id == parent_id);
        child.forEach((element) => {
          if (element.id) {
            arr.push({
              label: prefix + " " + element.name,
              value: element.id,
              isDisabled: id == element.id,
            });
          } else {
            arr.push({
              label: element.name,
              value: element.id,
              isDisabled: id == element.id,
            });
          }
          getCategoryTree(element.id, `${prefix}──`, arr);
        });
        return arr;
      };
      return getCategoryTree();
    }
    return [];
  };

  const Option = (props) => {
    const { children, innerRef, innerProps, value, isDisabled } = props;
    let start = children.indexOf("──");
    let end = children.lastIndexOf("──");
    let length = children.slice(start, end + 1).length;
    let child = `${value ? "|--" : ""}` + children.replace(/#|──/g, "");
    let paddingleft = length * 12;
    let style = {
      paddingLeft: `${paddingleft}px`,
      //   color: isDisabled ? "red" : "black",
    };
    return !isDisabled ? (
      <div style={{ padding: "7px 12px" }} className="custom-option-item">
        <div ref={innerRef} {...innerProps} style={style}>
          {child}
        </div>
      </div>
    ) : null;
  };

  return (
    <Select
      name={name}
      isSearchable={true}
      placeholder={placeHolder}
      value={defaultValue}
      options={formatTreeList(listOption)}
      isDisabled={isDisabled}
      isMulti={false}
      menuPortalTarget={
        isTarget ? document.querySelector(portalTarget) : null
      }
      isClearable={isClearable}
      onChange={onChange}
      components={{ Option }}
      className={className}
    />
  );
}

export default SelectProductCategory;
