import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static io.restassured.RestAssured.given;

public class StudentApiTest {

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://thetestingworldapi.com";
        RestAssured.basePath = "/api";
    }

    @Test
    public void postStudentDetail() throws URISyntaxException, IOException {
        JsonObject studentDetailRequest = new JsonObject();
        studentDetailRequest.addProperty("first_name", "Testing");
        studentDetailRequest.addProperty("middle_name", "API");
        studentDetailRequest.addProperty("last_name", "Automation");
        studentDetailRequest.addProperty("date_of_birth", "2010-01-02");


        Response studentDetailResponse = given().
                header("Content-type", "application/json").
                and().
                body(studentDetailRequest.toString())
                .when()
                .post("/studentsDetails")
                .then()
                .extract().response();

        Assert.assertEquals(studentDetailResponse.statusCode(), 201, "could not complete request with returned code: " + studentDetailResponse.statusCode());
        String id = studentDetailResponse.getBody().jsonPath().getString("id");

        // Technical Skills
        JsonObject techSkillRequestBody = new JsonObject();
        techSkillRequestBody.addProperty("id", id);
        JsonArray lang = new JsonArray();
        lang.add("Java");
        lang.add("Python");
        techSkillRequestBody.add("language", lang);
        techSkillRequestBody.addProperty("yearexp", "2");
        techSkillRequestBody.addProperty("lastused", "2020");
        techSkillRequestBody.addProperty("st_id", id);

        Response techSkillResponse = given().
                header("Content-type", "application/json").
                and().
                body(techSkillRequestBody.toString())
                .when()
                .post("/technicalskills")
                .then()
                .extract().response();
        Assert.assertEquals(techSkillResponse.statusCode(), 200, "could not complete request with returned code: " + techSkillResponse.statusCode());
        System.out.println("Technical Skills Response: "+ techSkillResponse.asPrettyString());

        // Add Address
        JsonObject addAddressRequestBody = JsonParser.parseString(getResourceAsString("AddAddressRequest.json")).getAsJsonObject();
        addAddressRequestBody.addProperty("stId", id);

        Response addAddressesResponse = given().
                header("Content-type", "application/json").
                and().
                body(addAddressRequestBody.toString())
                .when()
                .post("/addresses")
                .then()
                .extract().response();
        Assert.assertEquals(addAddressesResponse.statusCode(), 200, "could not complete request with returned code: " + addAddressesResponse.statusCode());

        // Get final student details
        Response finalStudentDetailResponse = given()
                .pathParams("id", id)
                .when()
                .get("/FinalStudentDetails/{id}")
                .then()
                .extract().response();
        Assert.assertEquals(finalStudentDetailResponse.statusCode(), 200, "could not complete request with returned code: " + finalStudentDetailResponse.statusCode());
        System.out.println("Final Student Details Response: "+ finalStudentDetailResponse.asPrettyString());

    }

    private String getResourceAsString(String resourcePath) throws URISyntaxException, IOException {
     return Files.readString(Paths.get(getClass().getClassLoader().getResource(resourcePath).toURI()));
    }
}
