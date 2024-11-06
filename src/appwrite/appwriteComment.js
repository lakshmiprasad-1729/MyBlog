import { Client,Databases,ID,Query } from "appwrite";

class appwriteComments{
    client = new Client();
    database;
    constructor(){
        this.client
        .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
        this.database = new Databases(this.client);
    }

    async getCommentDetails(documentid,userid){
        try {
            return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COMMENTSCOLLECTION_ID,
                [
                    Query.and([
                        Query.equal('documentid',documentid),
                        Query.equal('commentedUser',userid)
                    ])
                ]
             )
        } catch (error) {
            return error.message
        }
    }

    async createComment(documentid,userid,comment,userName){
        try {
           return  await this.database.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COMMENTSCOLLECTION_ID,
                ID.unique(),
                {
                    documentid:documentid,
                    commentedUser:userid,
                    comment:comment,
                    userName:userName
                }
            )
        } catch (error) {
            return error.message
        }
    }

    async editComment(docid,comment){
        try {
            await this.database.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COMMENTSCOLLECTION_ID,
                docid,
                {
                    comment:comment
                }
            )
            return true;
        } catch{
            return false
        }
    }

    async deleteComment(commentid){
        try {
            await this.database.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COMMENTSCOLLECTION_ID,
                commentid
            )
            return true;
        } catch (error) {
            return error.message
        }
    }
}

const AppwriteComments = new appwriteComments();
 
export default AppwriteComments;