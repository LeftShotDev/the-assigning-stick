# Design Prompt for Figma

## Prompt 1

I'm creating a simple 2-3 page application called "The Assigning Stick". The idea is we list jersey numbers a group of middle school kids can select for their upcoming lacrosse season. They will select up-to 3 number options & include their desired size. Then be assigned a jersey number when all kids have made their selections.

The Color pallet should be simple:
- Navy Blue for the primary color.
- Powder Blue for the secondary color.
- White, Black, & Gray as accent colors as needed.
- Any other colors to create the background will be fine.

Page 1: The public facing page should include a list of all jersey numbers available to the team. Display them on Powder blue jerseys with navy numbers with white outlines. We'd need a call to action for a player to submit their options. They're names will be selectable from a pre built list. Following their submission will be a notification telling them Coach is waiting for X number of players to respond & Assignments will be posted by February 1, 2026.

Page 2: The admin page. The admin will need to be able to input a roster with basic information - first, last name, grade, are they a returning player, did they participate in fall ball. After the list is inputted, they need to be able to see who from that list has made their submissions. Then they need a CTA to kick off the automated number assignment. They'll be able to preview the results & suggest manual edits before finalizing thing.

Page 3: Once the admin finalizes things, a public roster with names and jersey numbers should be present. Let's use the same jersey option with their name and assigned number displayed.

## Prompt 2

Overall, the concpet is there.

# Design Prompt for Claude Code

This project is currently the default next js project template from vercel. We'll be creating an app called "The Assigning Stick". It will be deployed to vercel and be powered by a Supabase based Postgres DB.

I'm creating a simple 2-3 page application. The idea is we list jersey numbers a group of middle school kids can select for their upcoming lacrosse season. They will select up-to 3 number options & include their desired size. Then be assigned a jersey number when all kids have made their selections.

Page 1: The public facing page should include a list of all jersey numbers available to the team. Display them on Powder blue jerseys with navy numbers with white outlines. We'd need a call to action for a player to submit their options. They're names will be selectable from a pre built list. Following their submission will be a notification telling them Coach is waiting for X number of players to respond & Assignments will be posted by February 1, 2026.

Page 2: The admin page. The admin will need to be able to input a roster with basic information - first, last name, grade, are they a returning player, did they participate in fall ball. After the list is inputted, they need to be able to see who from that list has made their submissions. Then they need a CTA to kick off the automated number assignment. They'll be able to preview the results & suggest manual edits before finalizing thing.

Page 3: Once the admin finalizes things, a public roster with names and jersey numbers should be present. Let's use the same jersey option with their name and assigned number displayed.

I'll add design comps momentarily

## Prompt for weighted assignment criteria

For assignment criteria, I would like to use a weighted system. Use the following criteria to sort the list of players into a selection order. Then we'd go through the player's options and find the best fit.

The criteria:

1. Returning Players. All returning players should get the option to keep their number from last year.

2. Particiaption in offseason practices.

3. Grade Level in decending order (8th grade then 7th grade, then 6th grade). This can act as a tie breaker for returning players changing number.

4. Jersey size. Each jersey should have a size associated with the number.

5. Smallest jersey number remaining. We'd have a list of numbers available.

## Answer to questions from the assignment prompt

Question 1 Answer: If a returning player want to keep their old number, they get it as the first priority.

If they want to change their number, they do fall into the weighted criteria with two noted differences: 1) They would get ranked by 2-5 against other returning players looking to change numbers, and 2) They would get priority over a new player with the same priority

Question 2 Answer: We will have an inventory that we can input. That should be added to the Admin page.

Question 3 Answer: If their number is available but not in their selected size we assign it to them. Size will matter most, or only, for the Smallest jersey number fallback.

Question 4 Answer: Yes, small number number in their size. If that's not available, smallest number in the closest size will work.