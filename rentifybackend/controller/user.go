package controller

import (
	"fmt"
	"net/http"
	"os"

	"github.com/AshishKothariii/rentifybackend/services"
	"github.com/AshishKothariii/rentifybackend/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)
type User struct {
	ID       string `json:"_id,omitempty"`
	Username string `json:"username,omitempty"`
}

// UserController handles web requests related to Users
type UserController struct {
        service services.UserService
}

// NewUserController creates a new UserController
func NewUserController(s services.UserService) *UserController {
        return &UserController{service: s}
}

// RegisterUser handles POST /register endpoint
func (uc *UserController) RegisterUser(c *gin.Context) {
        var userInfo struct {
        FirstName string             `bson:"firstname" json:"firstname"`
	LastName string              `bson:"lastname" json:"lastname"`
	Email    string             `bson:"email" json:"email"`
	MobileNo string         `bson:"mobileno" json:"mobileno"`
	Password string             `bson:"password" json:"password"`
        }

        if err := c.ShouldBindJSON(&userInfo); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
                return
        }

        user, err := uc.service.CreateUser(c, userInfo.FirstName,userInfo.LastName,userInfo.MobileNo, userInfo.Email, userInfo.Password)
        if err != nil {
                c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to create user"})
                return
        }
        token, err := utils.GenerateJWT(user.ID.Hex(), user.Email)
        if err != nil {
                        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
                        return
                }          
        c.SetCookie("token", token, 3600, "/", os.Getenv("CLIENT_URL"), false, false)


        c.JSON(http.StatusCreated, gin.H{"email":user.Email,"isLoggedin":true})
}

// Login handles POST /login endpoint
        func (uc *UserController) Login(c *gin.Context) {
                var credentials struct {
                        Email string `json:"email"`
                        Password string `json:"password"`
                }
          
                if err := c.ShouldBindJSON(&credentials); err != nil {
                        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
                        return
                }
                user, err := uc.service.CheckUserCredentials(c, credentials.Email, credentials.Password)
                if err != nil {
                        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
                        return
                }

                token, err := utils.GenerateJWT(user.ID.Hex(), user.Email)
                if err != nil {
                        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
                        return
                }
                        c.SetCookie("token", token, 3600, "/", os.Getenv("CLIENT_URL"), false, false)
                        c.JSON(http.StatusOK,gin.H{
                                "isLoggedin":true,
                                "email":user.Email,
                                
                        })
                
        }


func (uc *UserController)  Logout(c *gin.Context) {
        c.SetCookie("token", "", -1, "/", os.Getenv("CLIENT_URL"), false, true)
        c.JSON(http.StatusOK, gin.H{
                "isLoggedin":false,
        })
}
func (uc *UserController) GetProfile(c *gin.Context) {
                token, _ := c.Cookie("token")
               ans,_ := utils.ParseJWT(token)
               fmt.Println(ans)
               userid,_ :=primitive.ObjectIDFromHex(ans)
               user,err :=uc.service.GetUserByID(c,userid)
               if err!=nil{
                fmt.Print(err)
               }
          c.JSON(http.StatusOK, gin.H{
                        "name": user.FirstName+" "+user.LastName,
                        "mobileno": user.MobileNo,
                        "email":    user.Email,
                        "avatar":user.Avatar,

                })               


}
func (uc *UserController) GetUserByUserName(c *gin.Context) {
    var requestData struct {
        Email string `json:"email"`
    }

    if err := c.ShouldBindJSON(&requestData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Use the email from the request JSON
    email := requestData.Email

    user, err := uc.service.GetUserByEmail(c, email)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
        return
    }

    // Check if user is found
    if user == nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // Return user details as JSON response
    c.JSON(http.StatusOK, gin.H{
        "name":     user.FirstName + " " + user.LastName,
        "mobileno": user.MobileNo,
        "Avatar":   user.Avatar,
        "Email":    user.Email,
    })
}
