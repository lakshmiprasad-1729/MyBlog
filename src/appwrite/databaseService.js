import { Databases ,Client, ID ,Storage, ImageFormat, ImageGravity, Query} from "appwrite";

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
           const data = await this.database.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                ID.unique(),
                {
                    title:title,
                    content:content,
                    imageid:imageid,
                    userid:userid,
                    ownerName:ownerName,
                    likes:[
                        ''
                    ],

                }
            )
            return {active:true,msg:data}
          } catch (error) {
            return {active:false,msg:error.message}
          }
    }

    async listDocuments(){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                    Query.orderDesc('$createdAt'),
                    Query.limit(10)]

             )
        }
        catch(error){
            return error.message
        }
    }

    async listDocumentsNext(nextFileId){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
               [
                   Query.orderDesc('$createdAt'),
                   Query.cursorAfter(nextFileId),
                   Query.limit(10),
                ]
             )
        }
        catch(error){
            return error.message
        }
    }

    async listDocumentsPrev(beforeFileId){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [ 
                    Query.orderDesc('$createdAt'),
                    Query.cursorBefore(beforeFileId),
                    Query.limit(10),
                ]
             )
        }
        catch(error){
            return error.message
        }
    }


    async listUserDocuments(userId){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                    Query.equal("userid",[userId]),
                    Query.orderDesc("$createdAt"),
                    Query.limit(10)
                ]
             )
        }
        catch(error){
            return error.message
        }
    }

    async listUsersNextDocuments(userId,lastId){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                    Query.equal("userid",[userId]),
                    Query.orderDesc("$createdAt"),
                    Query.cursorAfter(lastId),
                    Query.limit(10)
                ]
             )
        }
        catch(error){
            return error.message
        }
    }

    async listUsersPrevDocuments(userId,firstId){
        try{
             return await this.database.listDocuments(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                [
                    Query.equal("userid",[userId]),
                    Query.orderDesc("$createdAt"),
                    Query.cursorBefore(firstId),
                    Query.limit(10)
                ]
             )
        }
        catch(error){
            return error.message
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
            return error.message
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
            return error.message
        }
    }
    
    async getFilePreview(fileId){
        try {
            return this.storage.getFilePreview(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                fileId,
                0, 
                0,
                ImageGravity.Center, 
                0,
                0, 
                "1e293b",
                6, 
                0, 
                -360, 
                'FFFFFF', 
                ImageFormat.Jpeg 
            )
        } catch (error) {
            return error.message
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

    async updatePost(data,postid){
        try {
           await this.database.updateDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            postid,
            data,
           )
           return true
        } catch (error) {
            return error.message;
        }
    }
    
    async updateRelation(doc,likeid){
        try {
            let ids =[];
            doc.likes.map((singeledoc)=>
                ids.push(singeledoc.$id)
              )
          if(doc.likes.length>0){
            return await this.database.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                doc.$id,
                {
                    likes:[
                        likeid,
                       ...ids
                    ]
                }
            )
          }
          else if(doc.likes.length===0){
            return await this.database.updateDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                doc.$id,
                {
                    likes:[
                        likeid
                    ]
                }
            )
          }
        } catch(err) {
           console.log(err.message)
        }
    }
    
    async updateCommentRelation(doc,comments,commentid){
        try {

            let ids =[];
            comments.map((singeledoc)=>
                ids.push(singeledoc.$id)
             )

            if(comments.length>0 && comments.length==ids.length){
                return await this.database.updateDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                    doc,
                    {
                        comments:[
                           ...ids,
                           commentid
                        ]
                    }
                )
            }
            else if(comments.length===0 && ids.length==0){
                return await this.database.updateDocument(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                    doc,
                    {
                        comments:[
                            commentid
                        ]
                    }
                )
              }
            
        } catch (error) {
            return error.message
        }
    }
}

const DatabaseService = new databaseService();

export default DatabaseService;