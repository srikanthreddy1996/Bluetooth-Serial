#include <Arduino.h>
#include <SoftwareSerial.h>
SoftwareSerial BT(6, 7); /// RX/TX
String inputString = "";         // a String to hold incoming data
bool stringComplete = false;  // whether the string is complete

void setup() {
  Serial.begin(9600);
  BT.begin(9600);
  //   BT.begin(38400);  //Baud Rate for AT-command Mode.
  inputString.reserve(200);
}

void loop() {
  if (stringComplete) {
    Serial.println(inputString);
    BT.println(inputString);
    // clear the string:
    inputString = "";
    stringComplete = false;
  }
  BtEvent();
}

void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}

void BtEvent(){
  while (BT.available()) {
    // get the new byte:
    char inChar = (char)BT.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}