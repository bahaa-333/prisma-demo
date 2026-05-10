CREATE VIEW "popular_books" AS
SELECT 
  b.id,
  b.title,
  b."authorId",
  b."publisherId",
  b.year,
  AVG(r.rating) as "averageRating",
  COUNT(r.id) as "reviewCount"
FROM "Book" b
JOIN "Review" r ON r."bookId" = b.id
GROUP BY b.id, b.title, b."authorId", b."publisherId", b.year
HAVING AVG(r.rating) > 4;