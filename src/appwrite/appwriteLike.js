import { Client, Databases, ID, Query } from "appwrite";

class appwriteLikes{
    client = new Client();
    database;
    constructor(){
        this.client
        .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
        this.database = new Databases(this.client);
    }

    async removeLike(id){
       try {
          await this.database.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_LIKESCOLLECTION_ID,
           id
          )
          return true
       } catch (error) {
        return error.message
       }
    }

    async Like(documentId,likedUser){
        try {
           return await this.database.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_LIKESCOLLECTION_ID,
                ID.unique(),
                {
                    documentid:documentId,
                    likedUser:likedUser
                }
            )
        } catch(error){
            console.log(error)
        }
    }

    async getLikeDetails(documentId,likedUser){
       try {
          return await this.database.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_LIKESCOLLECTION_ID,
            [
                Query.and([
                    Query.equal("documentid",documentId),
                    Query.equal("likedUser",likedUser)
                ])
            ]
           )
         
       } catch{
          return false
       }
    }
}

const AppwriteLikes = new appwriteLikes();

export default AppwriteLikes;