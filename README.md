# ElabFe

## Description

_ELAB LIMS is a laboratory information management system (LIMS) designed to streamline laboratory project management._

Built with Angular, it ensures high performance and scalability, providing an intuitive and responsive user experience. Researchers can efficiently track the entire lifecycle of samples, from reception to storage and reuse, ensuring comprehensive metadata capture.

The product is available in the following languages:
- English
- German
- French

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

### Additional Tools

- **Internationalization:** [i18next](https://www.i18next.com)
- **Chemical Structure Editing:** [Ketcher 2.24.0](https://lifescience.opensource.epam.com/ketcher/index.html#overview)
- **Chemical Informatics:** [RDKit](https://www.rdkitjs.com/#introduction)

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

#### **Permissions**

The following actions are available, restricted to **Procurement Officer**:

- **Create Order:** Create order with researchers' Requested reagents.
- **Edit Pending Order:** Edit: the title and seller of pending order.
- **Edit Requested Reagent in Pnednig Order:** Edit: the desired quantity, packages, package amounts of requested reagents.
- **Add Reagent Requests** Add more requested reagents to the pending orders.
- **Remove Requested Reagents:** Remove requested reagents from pending order.
- **Fulfill Order:** Assigne storage location to requested reagnets in Fulfilled orders.

#### **Filtering Options**

Procurement Officer can filter the orders table by:

- **Title:** Search for specific order by title.
- **Seller:** Search for specific order by Seller.
- **Status:** Find order based on their stratus: Pending, Submitted, Fulfilled or Declined.

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
