iris.resource(
function(self){
  
 // GET /shopping/collaborators/:shopping_id
 self.getCollaborators = function (shopping_id, success, error) {
  self.get("/shopping/collaborators/" + shopping_id, function(ret){
   success(ret.collaborators);
  }, error);
 };
   
 // POST /shopping/add/:shopping_id/collaborator/:email
 self.addCollaborator = function (shopping_id, email, success, error) {
  self.post("/shopping/add/" + shopping_id + "/collaborator/" + email, {}, function(ret){
   success(ret);
  }, error);
 };
 
 // DELETE /shopping/remove/:shopping_id/collaborator/:email
 self.removeCollaborator = function (shopping_id, email, success, error) {
  self.del("/shopping/remove/" + shopping_id + "/collaborator/" + email, function(ret){
   success(ret);
  }, error);
 };
 
 // PUT /shopping/accept/:shopping_id/collaborator/:email
 self.acceptCollaboration = function (shopping_id, email, success, error) {
  self.put("/shopping/accept/" + shopping_id + "/collaborator/" + email, {}, function(ret){
   success(ret);
  }, error);
 };
 
 // PUT /shopping/reject/:shopping_id/collaborator/:email
 self.rejectCollaboration = function (shopping_id, email, success, error) {
  self.put("/shopping/reject/" + shopping_id + "/collaborator/" + email, {}, function(ret){
   success(ret);
  }, error);
 };
 
},
iris.path.service.collaborators);
