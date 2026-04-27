using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

class MyDb:DbContext{
  	DBSet<Teacher> Teachers {Get;Set;}	 
	DBSet<TypeTeacher> TypeTeachers {Get;Set;} 

}
