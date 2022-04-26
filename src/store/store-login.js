import axios from 'axios'
const state ={};
const actions = {

    checkuser({state}, data ){
        return axios.get(`/ScanProductAPI/api/EMP/auth`, {
            params: data
        });
    },

    showBarcode({state}, data){
        return axios.get(`/ScanProductAPI/api/ScanProduct/getbarcode`,{
            params: data
        })
    },

    getgroupprice({state}, data){
        return axios.post(`/ScanProductAPI/api/ScanProduct/getgroupprice`,{
            params: data
        })
    },

    branchname({state}, data){
        return axios.post(`/ScanProductAPI/api/ScanProduct/getbranchname`,{
            params: data
        })
    },

    addItem({state}, data){
        return axios.post(`/ScanProductAPI/api/ScanProduct/insertBarcode`,{
            params: data
        })
    },

    deleteItem({state}, data){
        return axios.post(`/ScanProductAPI/api/ScanProduct/updateStatus`,{
            params: data
        })
    },

    //new api
    //Loginpage
    empFindName({state}, data){
        return axios.get(`/OrderToAxService/api/Employee/Emp_FindName`,{
            params: data
        })
    },

    encodePassword({state}, data){
        return axios.get(`/OrderToAxService/api/Employee/Emp_EncodePassword`,{
            params: data
        })
    },

    getBranch({state}, data){
        return axios.get(`/OrderToAxService/api/BranchDepart/GetBranchDetail_ByBchID`,{
            params: data
        })
    },
    //Homepage
    scanitem({state}, data){
        return axios.get(`/OrderToAxService/api/ScanItem/ScanItem_AllDetail`,{
            params: data
        })
    },
    findBarcode({state}, data){
        return axios.get(`/OrderToAxService/api/Barcode/Barcode_FindDetail`,{
            params: data
        })
    },
    insertBarcode({state}, data){
        // return axios.post(`/OrderToAxService/api/ScanItem/ScanItem_InsertData`, data)//frombody
        return axios.get(`/OrderToAxService/api/ScanItem/ScanItem_InsertData`,{
            params: data
        })
    },
    updateBarcode({state}, data){
        return axios.get(`/OrderToAxService/api/ScanItem/ScanItem_UpdateSta`,{
            params: data
        })
    },
    reloadPage({state}, data){
        return axios.get(`/OrderToAxService/api/ScanItem/ScanItem_RefreshSaleItem`,{
            params: data
        })
    },

};

export default {
    namespaced : true,
    actions,
    state
}
