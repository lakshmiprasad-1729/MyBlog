import { Client, Databases, ID, Query } from "appwrite";

class appwriteSubscribe{
    client = new Client();
    database;

    constructor(){
    this.client
    .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
    this.database = new Databases(this.client);
    }

    async Subscribe(ownerid,subscriberid,ownerName){
        try {
            return await this.database.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_SUBSCRIBERSCOLLECTION_ID,
                 ID.unique(),
                 {
                    owner:ownerid,
                    subscriber:subscriberid,
                    ownerName:ownerName
                 }
            )
        } catch (error) {
            return error.message;
            
        }
    }

    async unSubscribe(docid){
        try {
            await this.database.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_SUBSCRIBERSCOLLECTION_ID,
                docid
            )
            return true
        } catch (error) {
            return error.message
        }
    }

    async checkSubscribe(ownerid,subscriberid){
        try {
           return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_SUBSCRIBERSCOLLECTION_ID,
                [
                    Query.and([
                        Query.equal('owner',ownerid),
                        Query.equal('subscriber',subscriberid)
                    ])
                ]
            )
        } catch (error) {
         return error.message
        }
    }

    async subscribedAccounts(subscriberid){
        try {
           return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_SUBSCRIBERSCOLLECTION_ID,
                [
                    Query.equal("subscriber",subscriberid)
                ]
            )
        } catch{
            return false
        }
    }

    async checkFollowers(userid){
        try {
            let result = await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_SUBSCRIBERSCOLLECTION_ID,
                [
                    Query.equal("owner",userid)
                ]
            )

            return result.documents.length;
        } catch{
            return false
        }
    }
}

const AppwriteSubscribe = new appwriteSubscribe();

export default AppwriteSubscribe;