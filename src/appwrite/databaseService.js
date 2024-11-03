import { Databases ,Client, ID ,Storage, ImageFormat, ImageGravity, Query, Permission, Role} from "appwrite";

class databaseService{
    client = new Client();
    database ;
     storage;
    constructor(){
        this.client
        .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
        this.database = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createFile(title ,content ,userid,imageid,ownerName){
          try {
           await this.database.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                ID.unique(),
                {
                    title:title,
                    content:content,
                    imageid:imageid,
                    userid:userid,
                    ownerName:ownerName
                }
            )
            return {active:true,msg:"uploaded"}
          } catch (error) {
            console.log("error while creating a file or document at databaseService" , error.message)
            return {active:false,msg:error.message}
          }
    }

    async listDocuments(){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                    // Query.orderDesc('$createdAt'),
                    Query.limit(10)]

             )
        }
        catch(error){
           console.log(error.message)
        }
    }

    async listDocumentsNext(nextFileId){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
               [
                //    Query.orderDesc('$createdAt'),
                   Query.cursorAfter(nextFileId),
                   Query.limit(10),
                ]
             )
        }
        catch(error){
           console.log(error)
        }
    }

    async listDocumentsPrev(beforeFileId){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [ 
                    Query.cursorBefore(beforeFileId),
                    Query.limit(10),
                    // Query.orderDesc('$createdAt'),
                ]
             )
        }
        catch(error){
           console.log(error.message)
        }
    }


    async listUserDocuments(userId){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                    // Query.orderDesc("$createdAt"),
                    Query.equal("userid",[userId]),
                    Query.limit(10)
                ]
             )
        }
        catch(error){
           console.log(error.message)
        }
    }
    async listDocumentByFileId(fileId){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                   Query.equal("$id",[fileId])
                ]
             )
        }
        catch(error){
           console.log(error.message)
        }
    }


    async uploadFile(loaclPath){
        try {
          const imageData =  await this.storage.createFile(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                ID.unique(),
                loaclPath,
            )

            return imageData
            
        } catch (error) {
            console.log("error at uploading file" , error)
        }
    }

    async getFileView(fileId){
        try {
            return this.storage.getFileView(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                fileId
            )
        } catch (error) {
           console.log(error) 
        }
    }
    
    async getFilePreview(fileId){
        try {
            return this.storage.getFilePreview(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                fileId,
                350, // width (optional)
                0, // height (optional)
                ImageGravity.Center, // gravity (optional)
                0, // quality (optional)
                0, // borderWidth (optional)
                "1e293b", // borderColor (optional)
                6, // borderRadius (optional)
                0, // opacity (optional)
                -360, // rotation (optional)
                'FFFFFF', // background (optional)
                ImageFormat.Webp // output (optional)
            )
        } catch (error) {
           console.log(error) 
        }
    }

    async deletePost(postid,fileid){
        try {
            await this.database.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                postid
            )
            await this.deleteFile(fileid)
            return true
        } catch (error) {
            return error.message
        }
    }

    async deleteFile(fileId){
        try {
           await this.storage.deleteFile(import.meta.env.VITE_APPWRITE_BUCKET_ID,fileId) 
        } catch (error) {
            return error.message
        }
    }

    async updatePost({data},newimageid,postid,userid){
        try {
            await this.database.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                postid,
                {data},
                [
                    Permission.update(Role.user(userid))
                ]
            )
           newimageid?(
            await this.database.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                postid,
                {
                    imageid:newimageid
                },
                [
                    Permission.update(Role.user(userid))
                ]
            )
           ):null
           return true
        } catch (error) {
            return error.message;
        }
    }
}

const DatabaseService = new databaseService();

export default DatabaseService;