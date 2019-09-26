#include <FS.h>
#include <cstddef>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

#define FASTLED_ESP8266_RAW_PIN_ORDER
#include <FastLED.h>

FASTLED_USING_NAMESPACE

#if defined(FASTLED_VERSION) && (FASTLED_VERSION < 3001000)
#warning "Requires FastLED 3.1 or later; check github for latest code."
#endif

#define COLOR_ORDER GRB
#define BRIGHTNESS  195
#define LED_TYPE    WS2812B
#define NUM_LEDS    40
#define DATA_PIN    D1
CRGB leds[NUM_LEDS];

enum valueChange {up, down};            // Enum for changing speed and brightness
uint8_t maxBrightness;                  // Determined by voltage and amp in setup

unsigned long framesPerSecond = 120;    // Refresh rate
unsigned long time_now = 0;

uint8_t gCurrentPatternNumber = 0;      // Index number of which pattern is current
uint8_t gHue = 0;                       // Rotating "base color" used by many of the patterns
uint32_t customColorValue;              // Custom color

static const char ssid[]     = "ledLights";
static const char password[] = "password";

ESP8266WebServer server(80);            // Create a webserver object that listens for HTTP request on port 80
IPAddress apIP(1, 7, 3, 8);             // Sets IP address of arduino

String getContentType(String filename); // convert the file extension to the MIME type
bool handleFileRead(String path);       // send the right file to the client (if it exists)

String getContentType(String filename){
  if(filename.endsWith(".html")) return "text/html";
  else if(filename.endsWith(".css")) return "text/css";
  else if(filename.endsWith(".js")) return "application/javascript";
  else if(filename.endsWith(".ico")) return "image/x-icon";
  else if(filename.endsWith(".gz")) return "application/x-gzip";
  return "text/plain";
}

void sendDebugInfo(){                   // Send debug info
  char buffer [10];
  String currentBright = String(itoa(FastLED.getBrightness(), buffer, 10));
  String maxBright = String(itoa(maxBrightness, buffer, 10));
  String fps = String(itoa(framesPerSecond, buffer, 10));
  String currentCustomColor = String(itoa(customColorValue, buffer, 16));
 
  String info = "<h2>Info:</h2><table>";
  info += "<tr><td>Current Brightness:</td><td>"+ currentBright +"</td></tr>";
  info += "<tr><td>Max Brightness:</td><td>" + maxBright +"</td></tr>";
  info += "<tr><td>Current FPS:</td><td>" + fps +"</td></tr></table>";
  info += "<tr><td>Current Custom Color:</td><td>" + currentCustomColor +"</td></tr></table>";
  info += "<h2>SavedFile:</h2><table>";

  if (SPIFFS.exists("/savedStates.txt")) {
    File savedStateFile = SPIFFS.open("/savedStates.txt", "r");
    String line = savedStateFile.readStringUntil('\n');
    info += "<tr><td>Saved Pattern:</td><td>" + line.substring(line.indexOf("=")+1) +"</td></tr>";
    line = savedStateFile.readStringUntil('\n');
    info += "<tr><td>Saved Custom Color:</td><td>" + line.substring(line.indexOf("=")+1) +"</td></tr>";
    line = savedStateFile.readStringUntil('\n');
    info += "<tr><td>Saved FPS:</td><td>" + line.substring(line.indexOf("=")+1) +"</td></tr>";
    savedStateFile.close();
    info += "</table>";
  } else info += "<tr><td>Not Found:</td><td></table>";
 server.send(200, "text/html", info);
}

bool handleFileRead(String path){                       // send the right file to the client (if it exists)
  Serial.println("handleFileRead: " + path);
  if(path.endsWith("/")) path += "index.html";          // If a folder is requested, send the index file
  else if(path.endsWith("info")) {
    sendDebugInfo();                                    // Sends info for debuging.
    return true;
  }
  else if(path.endsWith(".css"));                       // If ends with .css do nothing
  else if(path.endsWith(".js"));                        // If ends with .js do nothing
  else path += ".html";                                 // Add .html
  String contentType = getContentType(path);            // Get the MIME type
  String pathWithGz = path + ".gz";
  if(SPIFFS.exists(pathWithGz) || SPIFFS.exists(path)){ // If the file exists, either as a compressed archive, or normal
    if(SPIFFS.exists(pathWithGz))                       // If there's a compressed version available
      path += ".gz";                                    // Use the compressed version
    File file = SPIFFS.open(path, "r");                 // Open the file
    size_t sent = server.streamFile(file, contentType); // Send it to the client
    file.close();                                       // Close the file again
    // Serial.println(String("\tSent file: ") + path);
    return true;
  }
  // Serial.println(String("\tFile Not Found: ") + path);
  return false;                                         // If the file doesn't exist, return false
}

void handlePreset(){                                    // Handle preset request
  if (server.args() == 1){
    server.send(200, "text/plain", "200: Okay");        // Respond to client
    String input = server.arg(0);                       // Get request data

    // Serial.print("Preset: ");
    // for(int i=1; i<input.length()-1; i++) {Serial.print(input.charAt(i));}
    // Serial.println("");
      
    if (input == "\"glitterbow\"") gCurrentPatternNumber = 1;
    else if (input == "\"confetti\"")   gCurrentPatternNumber = 2;
    else if (input == "\"rainbow\"")    gCurrentPatternNumber = 0;
    else if (input == "\"police\"")     gCurrentPatternNumber = 4;
    else if (input == "\"ledoff\"") {   gCurrentPatternNumber = 5; return;}
    else if (input == "\"sinelon\"")     gCurrentPatternNumber = 6;
    else if (input == "\"fourSinelons\"")     gCurrentPatternNumber = 7;
    else if (input == "\"brightnessDown\"") changeBrightness(down);
    else if (input == "\"brightnessUp\"") changeBrightness(up);
    else if (input == "\"speedDown\"") changeSpeed(down);
    else if (input == "\"speedUp\"") changeSpeed(up);
    saveState();                                        // Save current state to file
  } 
  else server.send_P(403, "text/plain", "403: Forbidden");
}

void handleCustomColor(){                               // Handle custom color request
  if(server.args() == 1) {
    server.send(200, "text/plain", "200: Okay");        // Respond to client
    String colorCode ="0x"+ server.arg(0).substring(1,7);
    // Serial.print("Custom color code: ");
    // for(int i=0; i<colorCode.length(); i++){Serial.print(colorCode.charAt(i));}
    // Serial.println("");
    customColorValue = strtoul(colorCode.c_str(), NULL, 16);
    gCurrentPatternNumber = 3;                          // Set mode to solid color
    saveState();                                        // Save current state to file
  } 
  else server.send_P(403, "text/plain", "403: Forbidden");
}

typedef void (*SimplePatternList[])();  // List of patterns
SimplePatternList gPatterns = { rainbow, rainbowWithGlitter, confetti, customColor, police, ledoff, sinelon, fourSinelons};

void handleRequest() {                                   // If the client requests any URI
  if (server.method() == HTTP_POST){                     // Check if it is a Post request
    if(server.uri() == "/color") handleCustomColor();    // Handle custom color post request
    else if(server.uri() == "/preset") handlePreset();   // Handle preset post request
    else server.send_P(403, "text/plain", "403: Forbidden");
  }
  else if (!handleFileRead(server.uri()))                // send it if it exists
    server.send(404, "text/plain", "404: Not Found");    // otherwise, respond with a 404 (Not Found) error
}

void changeBrightness(valueChange upDown){               // Change strip brightness
  uint8_t brightnessLevel = FastLED.getBrightness();
  if(upDown == up && brightnessLevel <= (maxBrightness - 15)){
    FastLED.setBrightness(brightnessLevel + 15);
  }
  else if(upDown == down && brightnessLevel > 15) {
    FastLED.setBrightness(brightnessLevel - 15);  
  }
}

void changeSpeed(valueChange upDown){                     // Change strip speed
  if(upDown == up && framesPerSecond < 240){
    framesPerSecond += 10;
  }
  else if(upDown == down && framesPerSecond > 20) {
    framesPerSecond -= 10;
  }
}

void ledoff(){
  fadeToBlackBy( leds, NUM_LEDS, 5);
}

void rainbow() {
  fill_rainbow( leds, NUM_LEDS, gHue, 7);
}

int policeCounter = 0;
void police() {
  // red and blue switching
  int grouped = (NUM_LEDS/4);
  for(int i = 0; i < grouped; i++){
    if(policeCounter < 120){
      leds[i] = CRGB::Blue;
      leds[i + grouped] = CRGB::Red;
      leds[i + (2 * grouped)] = CRGB::Blue;
      leds[i + (3 * grouped)] = CRGB::Red;
    } else {
      leds[i] = CRGB::Red;
      leds[i + grouped] = CRGB::Blue;
      leds[i + (2 * grouped)] = CRGB::Red;
      leds[i + (3 * grouped)] = CRGB::Blue;
    }
    if(policeCounter == 240){
      policeCounter = 0;
    }else {
      policeCounter++;   
    }
  }
}


void oneSinelon(){
  // a colored dot sweeping back and forth, with fading trails
  fadeToBlackBy( leds, NUM_LEDS, 20);
  int pos = beatsin16( 13, 0, NUM_LEDS-1 );
  leds[pos] += CHSV( gHue, 255, 192);
}

void sinelon(){
  int grouped = (NUM_LEDS/4);
  // a colored dot sweeping back and forth, with fading trails
  fadeToBlackBy( leds, NUM_LEDS, 20);
  int pos = beatsin16( 20, 0, (2*grouped)-1 );
  if(pos >= grouped){
   pos += (3*grouped); 
  }
  int pos2 = beatsin16( 20, grouped, (3*grouped)-1 );
  leds[pos] += CHSV( gHue, 255, 192);
}

void fourSinelons(){
  int grouped = (NUM_LEDS/4);
  // 4 colored dots sweeping back and forth, with fading trails
  fadeToBlackBy( leds, NUM_LEDS, 20);
  int pos1 = beatsin16( 40, 0, grouped-1 );
  int pos2 = beatsin16( 40, grouped, (2*grouped)-1 );
  int pos3 = beatsin16( 40, (2*grouped), (3*grouped)-1 );
  int pos4 = beatsin16( 40, (3*grouped), (4*grouped)-1 );
  leds[pos1] += CHSV( gHue, 255, 192);
  leds[pos2] += CHSV( gHue, 255, 192);
  leds[pos3] += CHSV( gHue, 255, 192);
  leds[pos4] += CHSV( gHue, 255, 192);
}

void rainbowWithGlitter() {
  rainbow();
  addGlitter(80);
}

void addGlitter( fract8 chanceOfGlitter) {
  if( random8() < chanceOfGlitter) {
    leds[ random16(NUM_LEDS) ] += CRGB::White;
  }
}

void confetti() {
  fadeToBlackBy( leds, NUM_LEDS, 10);
  int pos = random16(NUM_LEDS);
  leds[pos] += CHSV( gHue + random8(64), 200, 255);
}

void customColor(){
  fill_solid( leds, NUM_LEDS, customColorValue);
}

void checkForSavedStates(){
  if (SPIFFS.exists("/savedStates.txt")) {
    File savedStateFile = SPIFFS.open("/savedStates.txt", "r");
    String line = savedStateFile.readStringUntil('\n');
    gCurrentPatternNumber = line.substring(line.indexOf("=")+1).toInt();
    line = savedStateFile.readStringUntil('\n');
    customColorValue = line.substring(line.indexOf("=")+1).toInt();
    line = savedStateFile.readStringUntil('\n');
    framesPerSecond = line.substring(line.indexOf("=")+1).toInt();
    savedStateFile.close();
  }
}

void saveState(){
  File savedStateFile = SPIFFS.open("/savedStates.txt", "w");
    if (savedStateFile) {
      savedStateFile.print("PatternNumber=");
      savedStateFile.println(gCurrentPatternNumber);
      savedStateFile.print("ColorValue=");
      savedStateFile.println(customColorValue);
      savedStateFile.print("Speed=");
      savedStateFile.println(framesPerSecond);
    }
  savedStateFile.close();
}


void setup() {  
  Serial.begin(115200);

  // Create Wifi
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  Serial.print("Configuring access point...");
  WiFi.softAP(ssid, password);
  
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);

  // Start the SPI Flash Files System
  SPIFFS.begin();

  // Check for states from last session 
  checkForSavedStates();

  // Setup server
  server.onNotFound(handleRequest);  // handleRequest will handle all incoming requests
  server.begin();

  // Setup Led Strip
  FastLED.addLeds<LED_TYPE,DATA_PIN,COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setMaxPowerInVoltsAndMilliamps(5,2500); // limit my draw to 2.5A at 5v of power draw
  FastLED.setBrightness(BRIGHTNESS);
  maxBrightness = calculate_max_brightness_for_power_vmA(leds, NUM_LEDS, 255, 5, 2500);
  Serial.print("Max brightness allowed: ");
  Serial.println(maxBrightness);
}

void loop() {
  server.handleClient();
  if(millis() > time_now + (1000/framesPerSecond)){
      time_now = millis();
      gPatterns[gCurrentPatternNumber]();
      FastLED.show();
      EVERY_N_MILLISECONDS( 20 ) { gHue++; } // slowly cycle the "base color" through the rainbow
    }
}
