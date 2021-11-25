#include <SoftwareSerial.h>
//#include <NewPing.h>
//pir
#define PIR1 4
#define PIR2 5
#define LED 13
SoftwareSerial BT(2, 3); /// RX/TX

//ultra
//int trig=9;
//int echo=10;
//NewPing sonar(trig, echo, 300);
//int prev = 0;
//int curr = 0;
int detectCount = 0;
void setup()
{
  //pir
  pinMode(PIR1, INPUT);
  pinMode(PIR2, INPUT);
  pinMode(LED, OUTPUT);

  // Ultra
  //  pinMode(trig, OUTPUT);
  //  pinMode(echo, INPUT);
  Serial.begin(9600);
  BT.begin(9600);
  Serial.println("PIR Motion Detector");
  BT.println("PIR Motion Detector");
  delay(300);
  //  prev = curr = measure_distance();
}
void loop()
{
  delay(1000);
  //  curr = measure_distance();
  //  int diff = curr-prev;
  //  if(diff<=-2 || diff>=2){
  ////    Serial.print("Motion detected through UltraSonic with distance ");
  ////    Serial.print(curr);
  ////    Serial.println(" inches");
  //    BT.print("Motion detected through UltraSonic with distance ");
  //    BT.print(curr);
  //    BT.println(" inches");
  //    digitalWrite(LED, HIGH);
  //  }
  //  prev = curr;
  int P1 = digitalRead(PIR1);
  //  curr = measure_distance();
  int P2 = digitalRead(PIR2);
  if (P1 == HIGH && P2 == HIGH)
  {
    Serial.print(++detectCount);
    BT.print(detectCount);
    Serial.println(" Motion detected through both PIR's");
    BT.println(" Motion detected through both PIR's");
    //    Serial.print("Distance ");Serial.print(curr);Serial.println(" inches");
    //    BT.print("Distance ");BT.print(curr);BT.println(" inches");
    //digitalWrite(LED, HIGH);
  } else if (P1 == HIGH && P2 != HIGH) {
    Serial.print(++detectCount);
    BT.print(detectCount);
    Serial.println(" Motion detected through PIR1");
    BT.println(" Motion detected through PIR1");
    //digitalWrite(LED, HIGH);
  } else if (P1 != HIGH && P2 == HIGH) {
    Serial.print(++detectCount);
    BT.print(detectCount);
    Serial.println(" Motion detected through PIR2");
    BT.println(" Motion detected through PIR2");
    //digitalWrite(LED, HIGH);
  }


  //  if(P1 == HIGH || P2 == HIGH){
  //    Serial.println("Paused Sensing for 5 seconds");
  //    delay(5000);
  //  }
}

//int measure_distance(){
//  return sonar.ping_cm()/2.54;
//}
