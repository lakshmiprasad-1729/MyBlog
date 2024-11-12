class LocalStorage{
    jsonData;
    getData(){
        this.jsonData = localStorage.getItem("authData");
       return this.jsonData?this.jsonData:JSON.stringify({status:false,userdata:null})
    }
    setData(data){
        this.jsonData = JSON.stringify({status:true,userdata:data});
        localStorage.setItem('authData',this.jsonData);
    }
    removeData(){
        sessionStorage.removeItem('authData');
    }
    logoutData(){
        this.removeData();
        this.jsonData = JSON.stringify({status:false,userdata:null})
        localStorage.setItem('authData',this.jsonData);
    }
}

const localStorageService = new LocalStorage();

export default localStorageService;