package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/AshishKothariii/rentifybackend/controller"
	"github.com/AshishKothariii/rentifybackend/db"
	"github.com/AshishKothariii/rentifybackend/middleware"
	"github.com/AshishKothariii/rentifybackend/repository"
	"github.com/AshishKothariii/rentifybackend/services"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Print(err)
		return
	}
	// Connect to MongoDB
	client, err := db.Init()
	if err != nil {
		fmt.Println("db connection failed")
	}
	database := client.Database(os.Getenv("DB_NAME"))

	fmt.Print("till user repo up")
	// Initialize repositories
	userRepo := repository.NewUserRepository(database)

	fmt.Print("after user repo before service")
	// Initialize services
	userService := services.NewUserService(userRepo)
	// Initialize controllers
	userController := controller.NewUserController(userService)

	// Set up the router
	router := gin.Default()
	router.Use(gin.Logger())

	router.Use(middleware.CORSMiddleware())

	router.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, "test ok")
	})

	router.POST("/register", userController.RegisterUser)
	router.POST("/login", userController.Login)
	router.POST("/logout", userController.Logout)
	router.GET("/listings", userController.GetListings)
	router.GET("/profile",userController.GetProfile)
    router.POST("/listing/create",userController.CreateListing)
	router.GET("/listings/id/:id",userController.GetListingByID)
	router.DELETE("/listings/id/:id",userController.DeleteListing)
	router.GET("/mylistings",userController.GetListingsByEmail)
    router.POST("/userdetails",userController.GetUserByUserName)
	// Periodically broadcast online users
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := router.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}