# CS465-Fullstack

**Architecture**

Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).

The Express HTML implementation followed a traditional server rendered model where each request returned a fully refreshed page. JavaScript enhanced interactivity but still relied on server round trips. On the other hand, the Angular SPA dynamically updated content without reloading the entire page, providing a more responsive user experience through client-side routing and API integration.

Why did the backend use a NoSQL MongoDB database?

MongoDB was used because its document based structure aligns naturally with JavaScript and JSON data formats. Its flexible schema allows for scalable and adaptable data modeling, which is ideal for evolving application features like trips and bookings. This flexibility made development more efficient compared to a rigid relational schema. 

**Functionality**

How is JSON different from Javascript and how does JSON tie together the frontend and backend development pieces?

JSON is a data format used to transmit structured data, while JavaScript is a programming language used to implement logic and behavior. In this project, the Express back end returned data in JSON format, and the Angular frontend used that JSON data to dynamically render content. JSON acts as the communication bridge between the client and server layers.

Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.

My code was refactored by moving repeated HTTP logic into Angular services and centralizing authentication checks using backend middleware. Reusable UI components reduced redundancy, improved maintainability, and ensured consistent design patterns. Refactoring made the applicaiton more scalable, readable, and easier to debug.

**Testing**

Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.

HTTP methods such as GET, POST, PUT, and DELETE define how clients interact with API endpoints, and each endpoint must be tested to ensure correct responses and status codes. API testing verified proper database retrieval and updates, while authenticaiton testing ensured protected routes required valid JWT tokens. Adding security layers increased testing complexity but ensured role based access control and secure data handling.

**Reflection**

How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?

This course strengthend my full stack development skills by giving me hands-on experience with RESTful APIs, Angular SPAs, authentication, and database integration. I developed stronger debugging, architectural design, and security implementation skills. These experiences have improved my skill set for roles in game development and cybersecurity. 

