import React from "react";
import {
    Card,
    CardBody
} from "reactstrap";
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";
import { configTableOptions } from "../../utils/index";

function TableTab({ data, columns, isLoading, query, handleChangePage, handleChangeRowsPerPage }) {

    return (
        <Card className="animated fadeIn" style={{ marginBottom: 0 }}>
            <CardBody className={`py-0 px-0`}>
                <div className="MuiPaper-root__custom MuiPaper-user">
                    {isLoading ? (
                        <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                            <CircularProgress />
                        </div>
                    ) : (
                        <div>
                            <MUIDataTable
                                data={data.list}
                                columns={columns}
                                options={configTableOptions(data.total, 0, query)}
                            />
                            <CustomPagination
                                count={data.total}
                                rowsPerPage={query.itemsPerPage}
                                page={query.page - 1 || 0}
                                rowsPerPageOptions={[25, 50, 75, 100]}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}

export default TableTab;