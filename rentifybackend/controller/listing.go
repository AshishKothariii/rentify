package controller

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/AshishKothariii/rentifybackend/db"
	"github.com/AshishKothariii/rentifybackend/models"
	"github.com/AshishKothariii/rentifybackend/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (uc *UserController) CreateListing(c *gin.Context){
		client,err :=db.Init()
	if err!=nil{
		log.Fatal(err)
	c.JSON(http.StatusExpectationFailed,"failed")	
	}
	collection :=client.Database(os.Getenv("DB_NAME")).Collection("listings")
        token, _ := c.Cookie("token")
        ans,_ := utils.ParseJWT(token)
        fmt.Println(ans)
        userid,_ :=primitive.ObjectIDFromHex(ans)
        user,err :=uc.service.GetUserByID(c,userid)
        if err!=nil{
        fmt.Print(err)
        }
        image:= [...]string{
		"https://cityfurnish.com/blog/wp-content/uploads/2023/07/living-room-filled-with-furniture-red-wall-generative-ai-image-min.jpg",
		"https://elementreedrafting.com.au/wp-content/uploads/2015/05/What-makes-a-home-a-Luxury-Home.jpg",
		"https://media.designcafe.com/wp-content/uploads/2023/07/05141750/aesthetic-room-decor.jpg",
		"https://www.thespruce.com/thmb/Afg3IVBq0tV-7DHBME5woSNCZxQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg",
		"https://images.livspace-cdn.com/w:768/h:400/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/amj-2024-1711965337-VsMIK/living-room-1712816585-gZ0OZ/lr-4-1712816645-G02Fy.jpg",
	}
	
  var listing models.Listing
        if err := c.BindJSON(&listing); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
                return
        }
      listing.CreatedBy =user.Email
	  for i:=0;i<5;i++ {
      	randomNumber := getRandomNumber(0, 4)
       fmt.Print(randomNumber)
	   listing.ImageUrls=append(listing.ImageUrls,image[randomNumber])
	  }
      collection.InsertOne(context.Background(), listing)
      c.JSON(http.StatusOK, listing)
}
func (uc *UserController) GetListings(c *gin.Context) {
	client, err := db.Init()
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusExpectationFailed, "failed")
		return
	}
	collection := client.Database(os.Getenv("DB_NAME")).Collection("listings")

	listings := []*models.Listing{}
	cursor, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var listing models.Listing
		err := cursor.Decode(&listing)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		listings = append(listings, &listing)
	}

	c.JSON(http.StatusOK, gin.H{"listings": listings})
}

func (uc *UserController) DeleteListing(c *gin.Context) {
	fmt.Print("entered")
	client, err := db.Init()
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusExpectationFailed, "failed")
		return
	}
	collection := client.Database(os.Getenv("DB_NAME")).Collection("listings")

	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get the token from the request header
	token, _ := c.Cookie("token")
        ans,_ := utils.ParseJWT(token)
        fmt.Println(ans)
        userid,_ :=primitive.ObjectIDFromHex(ans)
        user,err :=uc.service.GetUserByID(c,userid)
        if err!=nil{
       fmt.Print(err)
       }

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
return
	}

	// Get the listing from the database
	var listing models.Listing
	err = collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&listing)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find listing"})
		return
	}

	// Check if the authenticated user is the creator of the listing
	if listing.CreatedBy != user.Email {
	c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to delete this listing"})
	return
	}

	// Delete the listing
	_, err = collection.DeleteOne(context.Background(), bson.M{"_id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete listing"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Listing has been deleted"})
}
func (uc *UserController) GetListingByID(c *gin.Context) {
	client, err := db.Init()
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusExpectationFailed, "failed")
		return
	}
	collection := client.Database(os.Getenv("DB_NAME")).Collection("listings")

	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var listing models.Listing
	err = collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&listing)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	c.JSON(http.StatusOK, listing)
}

func getRandomNumber(min, max int) int {
	rand.Seed(time.Now().UnixNano()) // Seed the random number generator with the current time
	return rand.Intn(max-min+1) + min // Generate and return a random number within the specified range
}
func (uc *UserController) GetListingsByEmail(c *gin.Context) {
	fmt.Print("hello")
	client, err := db.Init()
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusExpectationFailed, "failed")
		return
	}
	collection := client.Database(os.Getenv("DB_NAME")).Collection("listings")

	// Get the token from the request header
	token, _ := c.Cookie("token")
	fmt.Print(token)
	ans, err := utils.ParseJWT(token)
	fmt.Print(ans)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
     userid,_ :=primitive.ObjectIDFromHex(ans)
    user,err :=uc.service.GetUserByID(c,userid)
	if err!=nil{
		return
	}
	fmt.Print(user.Email)
	// Get all listings associated with the user's email
	listings := []*models.Listing{}
	cursor, err := collection.Find(context.Background(), bson.M{"createdby": user.Email})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var listing models.Listing
		err := cursor.Decode(&listing)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		listings = append(listings, &listing)
	}

	c.JSON(http.StatusOK, gin.H{"listings": listings})
}
