import { Client,Databases, ID, Query } from "appwrite";

class appwriteProfiles {
    client = new Client();
    database;
    constructor() {
        this.client
        .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
         this.database = new Databases(this.client);
    }

    async  createProfile(userid,userName,email) {
        try {
            await this.database.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_PROFILESCOLLECTION_ID,
                ID.unique(),
                {
                    userid:userid,
                    name:userName,
                    email:email,
                    searchname:userName.toLocaleLowerCase().replace(/\s|[@#$%^_-]|[0-9]/g, "")
                }
            )
            return true;
        } catch (error) {
            return error.message
        }
    }

    async getDocument(userid){
        try {
           return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_PROFILESCOLLECTION_ID,
                [
                    Query.equal("userid",userid)
                ]
            )
        } catch (error) {
            return error.message
        }
    }

    async updateName(name,id){
        try {
           await this.database.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_PROFILESCOLLECTION_ID,
                id,
                {
                    name:name,
                    searchname:name.toLocaleLowerCase().replace(/\s|[@#$%^_-]|[0-9]/g, "")
                }
            )
            return true
        } catch (error) {
            return error.message
        }
    }

    async updateEmail(email,id){
        try {
           await this.database.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_PROFILESCOLLECTION_ID,
                id,
                {
                    email:email
                }
            )
            return true
        } catch (error) {
            return error.message
        }
    }

    async searchProfile(searchname){
        try {
           return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_PROFILESCOLLECTION_ID,
                [
                    Query.search("searchname",searchname)
                ]
            )
        } catch (error) {
            return  error.message
        }
    }

}

const AppwriteProfiles = new appwriteProfiles()

export default AppwriteProfiles;