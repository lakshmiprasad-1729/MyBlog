import {Client,Account,ID,Permission,Role, OAuthProvider} from 'appwrite'

class authService {
    client = new Client();
    account;
    
    constructor(){
        this.client
        .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
        this.account = new Account(this.client);
    }

    async createAccount({name,email,password}){
         try {
          await this.account.create(
                ID.unique(),
                email,
                password,
                name,
                [
                    Permission.read(Role.guests()),    
                ]
            )
          return true;
           
         } catch (error) {
           return error.message
           
         }
    }

    async Login(email,password){
        try {
            await this.account.createEmailPasswordSession(email,password)
            return true;
        } catch (error) {
            return error.message;
            
        }
    }
    async Logout(){
        try {
            await this.account.deleteSession('current')
            return true;
        } catch (error) {
            return error.message
        }
    }

    async updateEmail(email,password){
        try {
           await this.account.updateEmail(
                email,
                password
            )
            return true;
        } catch (error) {
            return error.message
        }
    }

    async updatePassword(password ,oldPassword){
        try {
            await  this.account.updatePassword(password,oldPassword);
            return true
        } catch (error) {
            return error.message
        }
    }

    async updateName(name){
        try {
           await this.account.updateName(name);
            return true;
        } catch (error) {
            return error.message
        }
    }

    async getUser(){
        
            const userdata = await this.account.get();
            return userdata;
         
    }
     async getUserStatus (){
        try {
            await this.account.get();
            return true;
        } catch (error) {
            return error.message
        }
     }
    async getCurrentUser(){
        const userdata = await this.account.get();
            return userdata;
    }

    async logOutFromAllDevices(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            return error.message
        }
    }

    async LoginWithGoogle(){
        try {
            this.account.createOAuth2Token(
                OAuthProvider.Google,
                "https://my-blog-laxmi-prasads-projects.vercel.app/",
                "https://my-blog-laxmi-prasads-projects.vercel.app/error",
            )
            // this.account.createOAu+th2Session
        } catch (error) {
           return error.message 
        }
    }

    async google(a,b){
        try {
          const user =  this.account.createSession(a,b);
          return user
        } catch (error) {
           return error.message
        }
    }

    // async getUserById(){
    //     try {
    //         await this.account.
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
}

const AuthService = new authService();

export default AuthService;