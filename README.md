# ElabFe

## Description 

*ELAB LIMS is a laboratory information management system (LIMS) designed to streamline laboratory project management.*
 
Built with Angular, it ensures high performance and scalability, providing an intuitive and responsive user experience. Researchers can efficiently track the entire lifecycle of samples, from reception to storage and reuse, ensuring comprehensive metadata capture.

## Technology Stack
  ### Core Technologies
   - **Framework:** Angular 18
   - **Language:** TypeScript, JavaScript (ES6+)
   - **Styling:** SCSS, Angular Materials
   - **Package Manager:** npm 
  ### Tools & Utilities
   - **Linting & Formatting:** ESLint, Prettier
   - **Build Tool:** Angular CLI
   - **Version Control:** Git, GitHub
  ### Deployment 
   - **CI/CD:** GitHub Actions


## Core Features
  ### Authentication
   <!-- TODO: -->
  ### User Management
  <!--  -->
  ### Storage Location
  The **Storage Location Navigation** module is designed to manage and organize storage locations. It consists of two tabs:
  - **Storage Locations Tab:**  
    Displays a list of all storage locations. Users can view details of each location, such as its name, description, and associated metadata.

  - **Rooms Tab:**  
    Displays a list of rooms that contain storage locations. Users can view room details and manage their attributes.

  #### **Permissions**
  Only administrators have the ability to:
  - **Add:** Create new storage locations or rooms with relevant details.
  - **Edit:** Update existing storage location or room information.
  - **Delete:** Remove storage locations or rooms from the system.

  ### Reagents
  The **Reagents** is designed for managing and organizing reagents efficiently. It includes the following functionalities:
  
  #### **Permissions**
  The following actions are available, restricted to **researchers**:
  - **Create Sample/Reagent:** Add new entries to the reagents with relevant details.
  - **Edit Sample/Reagent:** Edit the quantity left of reagents and its storage location.
  - **Move Sample/Reagent:** Transfer reagents between different storage locations.
  - **Upload Sample/Reagent Table:** Bulk upload reagent information from a csv file.

  #### **Filtering Options**
  Users can filter the reagents table by:
  - **Name:** Search for specific reagents or samples by name.
  - **Chemical Structure:** Find reagents based on their chemical structure.
  - **Category:** Filter entries by "Sample" or "Reagent" categories.


  ### Reagent Request
  <!--  -->
  ### Order


## Useful links (DEV stand, API url)...
 - Backend Swagger: http://vm5.quantori.academy:3001/api/v1/swagger#/


## Architecture (modules, structure)
```
.
|-- app 
|----- auth
|-------- guards
|-------- roles
|-------- services
|----- pages
|-------- dashboard
|-------- storage-location
|-------- reagents
|-------- reagent-request
|-------- order
|-------- ...
|----- shared
|-------- components
|-------- models
|-------- services
|-------- ...
```
## Instructions
### Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Production Link
http://vm5.quantori.academy:8080/



