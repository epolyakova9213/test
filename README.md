Job text:
- 2+ years of web development experience.
- Solid background in HTML, CSS, cross-platform, and cross-browser compatibility.
- Proficiency in Vanila JS, Vue or React, and TypeScript.
- Experience with Webpack and Git.
- Experience with SSR and Next.js will be a plus.
- Critical thinking and problem-solving skills.
- Team player.
- Goog time-management skills.
- Great interpersonal and communication skills.

Text of the test task:
To assess your proficiency in Next.js and frontend development, we would like you to implement a simple responsive website with interactive elements. The website will consist of a header, body, and footer. The main feature in the body section will be an interactive game field where users can spawn and move rectangles with images inside.
- Implement a responsive layout with a header, body, and footer.
- Use SCSS for styling the components.
- Ensure the website has multiple pages. The main page should describe the website, and other pages should share the same header and footer but contain different content.
  Header:
- The header should be a simple bar at the top of the page with a placeholder for the website title or logo.
  Footer:
- The footer should be a bar at the bottom of the page with a placeholder for any footer content (e.g., copyright notice).
  Game Field (Body):
- In the body section of the game page, create a game field where rectangles can be spawned and moved around.
- The game field should occupy the remaining space between the header and footer and be responsive to window resizing.
  Rectangle Spawning:
- Implement a mechanism to spawn new rectangles within the game field when the user clicks on any empty spot.
- Each rectangle should contain an image (you can use any placeholder image).
- Spawning of a new rectangle should include an animation from the top left corner to the click/tap coordinates.
  Rectangle Interaction:
- Allow users to drag and move the rectangles around within the game field.
- Ensure the dragging interaction is smooth and responsive.
- The last interacted rectangle should always be on the top layer.
  Responsiveness:
- Ensure the entire application is responsive.
- When the browser window is resized, the game field should recalculate its size, and the rectangles should adjust their positions accordingly if necessary.
  Additional Pages:
- Implement a contact form on one of the pages. This form should include fields for the user's name, email, subject, and message, along with a submit button.
- Ensure all pages share the same header and footer for consistency.


Good afternoon. My name is Alexander. Here I will describe the implementation of the test task and the reasons why it is this way.
1. I'm not a NextJS professional, so the implementation may be questionable. However, I am conceptually familiar with server-side rendering and will quickly delve into it if necessary.
2. I am an adherent of vanilla JavaScript; I prefer the imperative approach to the declarative approach when implementing complex logic; I prefer MobX-like state managers compared to Redux; I try to follow the Model-View-Controller concept.
3. The test task does not use a state manager at all because the task is relatively small.
4. Of all the possible approaches to implementing such a game, I chose SVG for the following reasons:
   - z-index control suitable for the given task;
   - DOM events;
   - good enough speed.
   
   As a result of the implementation, I think that drawing on canvas would be more productive. Unfortunately, there was not enough time to implement it.
5. When implementing the communication form, I used my own developments, which were written a year ago. They are suitable for implementation in a simple form, but overall they look dubious. I would rewrite it with pleasure, but the task has already taken a long time.

A more detailed analysis can be found in the comments.

For start
```npm run dev```