#include <SoftwareSerial.h>
#include <NewPing.h>
//pir
#define PIR1 4
#define PIR2 5
#define LED 13
SoftwareSerial BT(2,3); /// RX/TX

//ultra
int trig=9;
int echo=10;
NewPing sonar(trig, echo, 400);
int prev = 0;
int curr = 0; 

void setup()
{
  //pir
  pinMode(PIR1, INPUT);
  pinMode(LED, OUTPUT);

  // Ultra
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
  Serial.begin(9600);
  BT.begin(9600);
  Serial.println(" PIR Motion Detector ");
  BT.println(" PIR Motion Detector ");
  delay(300);
  prev = curr = sonar.ping_cm()/2.54;
}
void loop()
{
  delay(500);
  curr = sonar.ping_cm()/2.54;
  int diff = curr-prev;
  if(diff<=-1 || diff>=1){
    Serial.print("Motion detected through UltraSonic with distance ");
    Serial.print(curr);
    Serial.println(" inches");
    BT.print("Motion detected through UltraSonic with distance ");
    BT.print(curr);
    BT.println(" inches");
    digitalWrite(LED, HIGH);
  }else{
    Serial.println("No motion detected through UltraSonic");
    BT.println("No motion detected through UltraSonic");
    digitalWrite(LED,LOW);
  }
  prev = curr;
  int P1 = digitalRead(PIR1);
  int P2 = digitalRead(PIR2);
  if(P1 == HIGH && P2 == HIGH)
  {
    Serial.println(" Motion detected through both PIR's");
    BT.println(" Motion detected through both PIR's");
    digitalWrite(LED, HIGH);
  }else if(P1 == HIGH && P2 != HIGH){
    Serial.println(" Motion detected through PIR1");
    BT.println(" Motion detected through PIR1");
    digitalWrite(LED, HIGH);
  }else if(P1 == HIGH && P2 != HIGH){
    Serial.println(" Motion detected through PIR1");
    BT.println(" Motion detected through PIR1");
    digitalWrite(LED, HIGH);
  } 
  else
  { 
    Serial.println(" No motion through PIR's");
    BT.println(" No motion through PIR's");
    digitalWrite(LED,LOW);
  }
}
