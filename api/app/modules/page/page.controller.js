const SingleResponse = require('../../common/responses/single.response');
const pageService = require('./page.service');

const getListpage = async (req, res, next) => {
    try {
        const serviceRes = await pageService.getListPage(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}

const createOrUpdatePage = async (req, res, next) => {
    try {
        const serviceRes = await pageService.createOrUpdatePage(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const detailPage = async (req, res, next) => {
    try {
        let { page_id } = req.params;
        const serviceRes = await pageService.detailPage(page_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deletePage = async (req, res, next) => {
    try {
        const {page_id} = req.params;
        req.body.page_id = page_id;
        const serviceRes = await pageService.deletePage(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(
            new SingleResponse(null, 'Xoá Page thành công.')
        );
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListpage,
    createOrUpdatePage,
    deletePage,
    detailPage
}
