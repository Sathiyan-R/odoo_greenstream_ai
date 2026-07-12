CREATE DATABASE IF NOT EXISTS greenstream;
USE greenstream;

CREATE TABLE IF NOT EXISTS chennai_environment_status (
  id VARCHAR(64) PRIMARY KEY,
  zone_name VARCHAR(255) NOT NULL,
  zone_region VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,6) NOT NULL,
  longitude DECIMAL(10,6) NOT NULL,
  temperature DECIMAL(10,2) NOT NULL,
  humidity DECIMAL(10,2),
  aqi INT NOT NULL,
  energy_consumption DECIMAL(12,2) NOT NULL,
  energy_variance DECIMAL(12,2),
  carbon_emission DECIMAL(12,2) NOT NULL,
  sustainability_score INT NOT NULL,
  wind_speed DECIMAL(10,2),
  zone_area DECIMAL(10,2),
  trend_temperature VARCHAR(8),
  trend_aqi VARCHAR(8),
  trend_energy VARCHAR(8),
  prediction_tomorrow TEXT,
  ai_suggestion TEXT,
  last_updated DATETIME
);

INSERT INTO chennai_environment_status (
  id, zone_name, zone_region, latitude, longitude, temperature, humidity, aqi,
  energy_consumption, energy_variance, carbon_emission, sustainability_score, wind_speed,
  zone_area, trend_temperature, trend_aqi, trend_energy, prediction_tomorrow, ai_suggestion, last_updated
) VALUES
('zone-1','North Chennai','Industrial & Port Area',13.148200,80.261900,34.80,68.40,126,2480.00,310.00,2033.60,63,8.40,40,'↑','↓','→','Stable conditions expected with minor variations.','Monitor air quality and energy use closely.',NOW()),
('zone-2','Central Chennai','Urban Core & Commercial',13.082700,80.270700,33.20,66.10,111,2120.00,270.00,1738.40,68,9.10,45,'→','→','↑','Slight warming expected tomorrow.','Maintain efficiency measures through peak hours.',NOW()),
('zone-3','South Chennai','IT Corridor & Residential',12.924900,80.227000,32.10,71.20,99,1840.00,220.00,1508.80,74,10.20,50,'↓','→','↓','Air quality remains stable.','Continue sustainable building operations.',NOW()),
('zone-4','OMR / IT Corridor','Technology Hub',12.935200,80.243000,31.80,69.50,107,2050.00,260.00,1681.00,69,9.80,48,'→','↓','→','Expect moderate winds and warm conditions.','Use peak solar hours for high-load usage.',NOW()),
('zone-5','Industrial Belt','Manufacturing Zone',13.114300,80.154800,35.60,67.40,138,2650.00,330.00,2169.00,58,7.90,42,'↑','↑','↑','High industrial activity may increase emissions.','Immediate intervention recommended for emissions.',NOW())
ON DUPLICATE KEY UPDATE
  zone_region=VALUES(zone_region),
  latitude=VALUES(latitude),
  longitude=VALUES(longitude),
  temperature=VALUES(temperature),
  humidity=VALUES(humidity),
  aqi=VALUES(aqi),
  energy_consumption=VALUES(energy_consumption),
  energy_variance=VALUES(energy_variance),
  carbon_emission=VALUES(carbon_emission),
  sustainability_score=VALUES(sustainability_score),
  wind_speed=VALUES(wind_speed),
  zone_area=VALUES(zone_area),
  trend_temperature=VALUES(trend_temperature),
  trend_aqi=VALUES(trend_aqi),
  trend_energy=VALUES(trend_energy),
  prediction_tomorrow=VALUES(prediction_tomorrow),
  ai_suggestion=VALUES(ai_suggestion),
  last_updated=VALUES(last_updated);
