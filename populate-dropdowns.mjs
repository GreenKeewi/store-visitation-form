// MongoDB Data Population Script
// Run this script to populate your MongoDB with initial dropdown data

import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env.local" });

async function populateDropdownData() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "store-visitation-tracker";

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    return;
  }

  console.log("🔄 Connecting to MongoDB...");

  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);

    // Territory Managers Data
    const territoryManagers = [
      // existing/demo entries
      { name: "Tom Scott", active: true, createdAt: new Date() },
      { name: "John Smith", active: true, createdAt: new Date() },
      { name: "Tim Horton", active: true, createdAt: new Date() },
      { name: "Mason Anderson", active: true, createdAt: new Date() },
      { name: "Liam Miller", active: true, createdAt: new Date() },

      // names requested to be added
      { name: "Jack Campbell", active: true, createdAt: new Date() },
      { name: "Steve Malfait", active: true, createdAt: new Date() },
      { name: "Todd Langenfeld", active: true, createdAt: new Date() },
      { name: "Benjamin Bezooyen", active: true, createdAt: new Date() },
      { name: "Jordan James", active: true, createdAt: new Date() },
      { name: "Steve Clements", active: true, createdAt: new Date() },
      { name: "Eric Girard", active: true, createdAt: new Date() },
      { name: "Travis Schriver", active: true, createdAt: new Date() },
      { name: "Steve Mclinchey", active: true, createdAt: new Date() },
      { name: "Chris Babiy", active: true, createdAt: new Date() },
      { name: "Mike Olsen", active: true, createdAt: new Date() },
      { name: "Dan Reggi", active: true, createdAt: new Date() },
      { name: "Mark Rozon", active: true, createdAt: new Date() },
      { name: "Bastien Ferland", active: true, createdAt: new Date() },
      { name: "Aaron Kirkhus", active: true, createdAt: new Date() },
      { name: "Charles Cotton", active: true, createdAt: new Date() },
      { name: "Alfonso Catania", active: true, createdAt: new Date() },
    ];

    // Stores Data
    const stores = [
      { name: "SCARBOROUGH", number: "7001", address: "", active: true, createdAt: new Date() },
      { name: "WOODBRIDGE", number: "7002", address: "", active: true, createdAt: new Date() },
      { name: "OAKVILLE", number: "7003", address: "", active: true, createdAt: new Date() },
      { name: "MARKHAM", number: "7004", address: "", active: true, createdAt: new Date() },
      { name: "WHITBY", number: "7005", address: "", active: true, createdAt: new Date() },
      { name: "BRAMPTON SOUTH", number: "7006", address: "", active: true, createdAt: new Date() },
      { name: "ANCASTER", number: "7007", address: "", active: true, createdAt: new Date() },
      { name: "HAMILTON", number: "7008", address: "", active: true, createdAt: new Date() },
      { name: "LONDON NORTH", number: "7009", address: "", active: true, createdAt: new Date() },
      { name: "ETOBICOKE SOUTH", number: "7011", address: "", active: true, createdAt: new Date() },
      { name: "CURITY", number: "7012", address: "", active: true, createdAt: new Date() },
      { name: "STOCKYARDS", number: "7013", address: "", active: true, createdAt: new Date() },
      { name: "KITCHENER", number: "7017", address: "", active: true, createdAt: new Date() },
      { name: "BURLINGTON", number: "7021", address: "", active: true, createdAt: new Date() },
      { name: "SUDBURY", number: "7022", address: "", active: true, createdAt: new Date() },
      { name: "ST. CATHARINES", number: "7023", address: "", active: true, createdAt: new Date() },
      { name: "BARRIE", number: "7024", address: "", active: true, createdAt: new Date() },
      { name: "GLOUCESTER", number: "7025", address: "", active: true, createdAt: new Date() },
      { name: "NEPEAN", number: "7026", address: "", active: true, createdAt: new Date() },
      { name: "MORNINGSIDE", number: "7027", address: "", active: true, createdAt: new Date() },
      { name: "NEWMARKET", number: "7030", address: "", active: true, createdAt: new Date() },
      { name: "KELOWNA", number: "7032", address: "", active: true, createdAt: new Date() },
      { name: "LONDON SW", number: "7033", address: "", active: true, createdAt: new Date() },
      { name: "SAULT STE. MARIE", number: "7034", address: "", active: true, createdAt: new Date() },
      { name: "PARK ROYAL", number: "7035", address: "", active: true, createdAt: new Date() },
      { name: "MEDICINE HAT", number: "7036", address: "", active: true, createdAt: new Date() },
      { name: "CALGARY NORTH HILLS", number: "7037", address: "", active: true, createdAt: new Date() },
      { name: "BRANDON", number: "7038", address: "", active: true, createdAt: new Date() },
      { name: "NANAIMO", number: "7040", address: "", active: true, createdAt: new Date() },
      { name: "LANGLEY", number: "7041", address: "", active: true, createdAt: new Date() },
      { name: "VANCOUVER", number: "7042", address: "", active: true, createdAt: new Date() },
      { name: "RICHMOND", number: "7043", address: "", active: true, createdAt: new Date() },
      { name: "SOUTH SURREY", number: "7044", address: "", active: true, createdAt: new Date() },
      { name: "COQUITLAM", number: "7045", address: "", active: true, createdAt: new Date() },
      { name: "NORTH SURREY", number: "7046", address: "", active: true, createdAt: new Date() },
      { name: "BURNABY", number: "7047", address: "", active: true, createdAt: new Date() },
      { name: "SPRUCE GROVE", number: "7050", address: "", active: true, createdAt: new Date() },
      { name: "SASKATOON", number: "7051", address: "", active: true, createdAt: new Date() },
      { name: "REGINA", number: "7052", address: "", active: true, createdAt: new Date() },
      { name: "SQUAMISH", number: "7053", address: "", active: true, createdAt: new Date() },
      { name: "VICTORIA (SAANICH)", number: "7055", address: "", active: true, createdAt: new Date() },
      { name: "CROSSROADS", number: "7056", address: "", active: true, createdAt: new Date() },
      { name: "POLO PARK", number: "7057", address: "", active: true, createdAt: new Date() },
      { name: "ST. VITAL", number: "7058", address: "", active: true, createdAt: new Date() },
      { name: "MARLBOROUGH", number: "7061", address: "", active: true, createdAt: new Date() },
      { name: "CLAREVIEW", number: "7062", address: "", active: true, createdAt: new Date() },
      { name: "CALGARY CHINOOK", number: "7063", address: "", active: true, createdAt: new Date() },
      { name: "WEST END", number: "7064", address: "", active: true, createdAt: new Date() },
      { name: "SOUTH COMMON", number: "7065", address: "", active: true, createdAt: new Date() },
      { name: "SHAWNESSY", number: "7067", address: "", active: true, createdAt: new Date() },
      { name: "LEASIDE", number: "7073", address: "", active: true, createdAt: new Date() },
      { name: "VICTORIA", number: "7074", address: "", active: true, createdAt: new Date() },
      { name: "CORNWALL", number: "7075", address: "", active: true, createdAt: new Date() },
      { name: "CALGARY BEACON HILL", number: "7076", address: "", active: true, createdAt: new Date() },
      { name: "ST. JOHN'S", number: "7077", address: "", active: true, createdAt: new Date() },
      { name: "DUFFERIN AND STEELES", number: "7078", address: "", active: true, createdAt: new Date() },
      { name: "BARRHAVEN", number: "7079", address: "", active: true, createdAt: new Date() },
      { name: "GERRARD SQUARE", number: "7080", address: "", active: true, createdAt: new Date() },
      { name: "KINGSTON", number: "7081", address: "", active: true, createdAt: new Date() },
      { name: "CALGARY SOUTHEAST", number: "7082", address: "", active: true, createdAt: new Date() },
      { name: "VERNON", number: "7084", address: "", active: true, createdAt: new Date() },
      { name: "BROCKVILLE", number: "7085", address: "", active: true, createdAt: new Date() },
      { name: "WINNIPEG SW", number: "7086", address: "", active: true, createdAt: new Date() },
      { name: "VICTORIAVILLE", number: "7087", address: "", active: true, createdAt: new Date() },
      { name: "ST ALBERT", number: "7088", address: "", active: true, createdAt: new Date() },
      { name: "SHERBROOKE", number: "7089", address: "", active: true, createdAt: new Date() },
      { name: "THUNDER BAY", number: "7102", address: "", active: true, createdAt: new Date() },
      { name: "SAINT JOHN", number: "7103", address: "", active: true, createdAt: new Date() },
      { name: "WATERLOO", number: "7105", address: "", active: true, createdAt: new Date() },
      { name: "RICHMOND HILL", number: "7106", address: "", active: true, createdAt: new Date() },
      { name: "EGLINTON EAST", number: "7107", address: "", active: true, createdAt: new Date() },
      { name: "KANATA", number: "7108", address: "", active: true, createdAt: new Date() },
      { name: "AJAX", number: "7109", address: "", active: true, createdAt: new Date() },
      { name: "BRAMPTON NORTH", number: "7110", address: "", active: true, createdAt: new Date() },
      { name: "CALGARY", number: "7111", address: "", active: true, createdAt: new Date() },
      { name: "MISSISSAUGA SOUTH", number: "7112", address: "", active: true, createdAt: new Date() },
      { name: "REXDALE", number: "7114", address: "", active: true, createdAt: new Date() },
      { name: "OAKVILLE BURLOAK", number: "7115", address: "", active: true, createdAt: new Date() },
      { name: "PETERBOROUGH", number: "7116", address: "", active: true, createdAt: new Date() },
      { name: "EDMONTON", number: "7117", address: "", active: true, createdAt: new Date() },
      { name: "ORLEANS", number: "7118", address: "", active: true, createdAt: new Date() },
      { name: "SKYVIEW", number: "7119", address: "", active: true, createdAt: new Date() },
      { name: "SURREY (WHITEROCK)", number: "7122", address: "", active: true, createdAt: new Date() },
      { name: "OSHAWA", number: "7123", address: "", active: true, createdAt: new Date() },
      { name: "LAVAL", number: "7124", address: "", active: true, createdAt: new Date() },
      { name: "HALIFAX", number: "7126", address: "", active: true, createdAt: new Date() },
      { name: "ST. HENRI", number: "7128", address: "", active: true, createdAt: new Date() },
      { name: "YORKDALE", number: "7129", address: "", active: true, createdAt: new Date() },
      { name: "MISSISSAUGA WEST", number: "7130", address: "", active: true, createdAt: new Date() },
      { name: "RED DEER", number: "7131", address: "", active: true, createdAt: new Date() },
      { name: "MISSISSAUGA BRITANNIA", number: "7132", address: "", active: true, createdAt: new Date() },
      { name: "BELLEVILLE", number: "7133", address: "", active: true, createdAt: new Date() },
      { name: "CALEDONIA", number: "7134", address: "", active: true, createdAt: new Date() },
      { name: "AURORA", number: "7135", address: "", active: true, createdAt: new Date() },
      { name: "MARKHAM EAST", number: "7136", address: "", active: true, createdAt: new Date() },
      { name: "ORILLIA", number: "7137", address: "", active: true, createdAt: new Date() },
      { name: "BRANTFORD", number: "7138", address: "", active: true, createdAt: new Date() },
      { name: "LACHENAIE", number: "7139", address: "", active: true, createdAt: new Date() },
      { name: "GATINEAU", number: "7140", address: "", active: true, createdAt: new Date() },
      { name: "ABBOTSFORD", number: "7141", address: "", active: true, createdAt: new Date() },
      { name: "GUELPH", number: "7142", address: "", active: true, createdAt: new Date() },
      { name: "KAMLOOPS", number: "7144", address: "", active: true, createdAt: new Date() },
      { name: "PORT COQUITLAM", number: "7145", address: "", active: true, createdAt: new Date() },
      { name: "L'ACADIE", number: "7146", address: "", active: true, createdAt: new Date() },
      { name: "ST. JEROME", number: "7147", address: "", active: true, createdAt: new Date() },
      { name: "MONCTON", number: "7148", address: "", active: true, createdAt: new Date() },
      { name: "BEAUBIEN OUEST", number: "7149", address: "", active: true, createdAt: new Date() },
      { name: "ST. BRUNO", number: "7150", address: "", active: true, createdAt: new Date() },
      { name: "SYDNEY", number: "7151", address: "", active: true, createdAt: new Date() },
      { name: "GREENFIELD PARK", number: "7152", address: "", active: true, createdAt: new Date() },
      { name: "SARNIA", number: "7153", address: "", active: true, createdAt: new Date() },
      { name: "OWEN SOUND", number: "7154", address: "", active: true, createdAt: new Date() },
      { name: "ANJOU", number: "7156", address: "", active: true, createdAt: new Date() },
      { name: "TRAFALGAR VILLAGE", number: "7157", address: "", active: true, createdAt: new Date() },
      { name: "SOUTH KEYS", number: "7158", address: "", active: true, createdAt: new Date() },
      { name: "BOISBRIAND", number: "7159", address: "", active: true, createdAt: new Date() },
      { name: "NORTH BAY", number: "7160", address: "", active: true, createdAt: new Date() },
      { name: "RICHMOND HILL NORTH", number: "7161", address: "", active: true, createdAt: new Date() },
      { name: "LEBOURGNEUF", number: "7162", address: "", active: true, createdAt: new Date() },
      { name: "STE-FOY", number: "7163", address: "", active: true, createdAt: new Date() },
      { name: "BRACEBRIDGE", number: "7164", address: "", active: true, createdAt: new Date() },
      { name: "CAMBRIDGE", number: "7166", address: "", active: true, createdAt: new Date() },
      { name: "ORANGEVILLE", number: "7167", address: "", active: true, createdAt: new Date() },
      { name: "TROIS RIVIERES", number: "7169", address: "", active: true, createdAt: new Date() },
      { name: "LETHBRIDGE", number: "7170", address: "", active: true, createdAt: new Date() },
      { name: "PRINCE GEORGE", number: "7171", address: "", active: true, createdAt: new Date() },
      { name: "SHERWOOD PARK", number: "7172", address: "", active: true, createdAt: new Date() },
      { name: "CHARLOTTETOWN", number: "7173", address: "", active: true, createdAt: new Date() },
      { name: "NIAGARA FALLS", number: "7174", address: "", active: true, createdAt: new Date() },
      { name: "GRANDE PRAIRIE", number: "7175", address: "", active: true, createdAt: new Date() },
      { name: "COURTENAY", number: "7177", address: "", active: true, createdAt: new Date() },
      { name: "CHATHAM", number: "7178", address: "", active: true, createdAt: new Date() },
      { name: "KITCHENER WEST", number: "7179", address: "", active: true, createdAt: new Date() },
      { name: "WINNIPEG NORTH", number: "7180", address: "", active: true, createdAt: new Date() },
      { name: "WOODSTOCK", number: "7182", address: "", active: true, createdAt: new Date() },
      { name: "WINDSOR EAST", number: "7184", address: "", active: true, createdAt: new Date() },
      { name: "ST. CONSTANT", number: "7185", address: "", active: true, createdAt: new Date() },
      { name: "VAUDREUIL", number: "7187", address: "", active: true, createdAt: new Date() },
      { name: "GRANBY", number: "7188", address: "", active: true, createdAt: new Date() },
      { name: "ST. ROMUALD", number: "7189", address: "", active: true, createdAt: new Date() },
      { name: "CAMPBELL RIVER", number: "7221", address: "", active: true, createdAt: new Date() },
      { name: "FORT SASKATCHEWAN", number: "7222", address: "", active: true, createdAt: new Date() },
      { name: "OKOTOKS", number: "7223", address: "", active: true, createdAt: new Date() },
      { name: "ST JEAN SUR RICHELIEU", number: "7224", address: "", active: true, createdAt: new Date() },
      { name: "PARRY SOUND", number: "7226", address: "", active: true, createdAt: new Date() },
      { name: "EDMONTON WESTMOUNT", number: "7227", address: "", active: true, createdAt: new Date() },
      { name: "WINDSOR", number: "7228", address: "", active: true, createdAt: new Date() },
      { name: "FREDERICTON", number: "7233", address: "", active: true, createdAt: new Date() },
      { name: "COLLINGWOOD", number: "7234", address: "", active: true, createdAt: new Date() },
      { name: "TIMMINS", number: "7236", address: "", active: true, createdAt: new Date() },
      { name: "LONDON EAST", number: "7237", address: "", active: true, createdAt: new Date() },
      { name: "PICKERING", number: "7238", address: "", active: true, createdAt: new Date() },
      { name: "BRAMPTON EAST", number: "7239", address: "", active: true, createdAt: new Date() },
      { name: "BOWMANVILLE", number: "7240", address: "", active: true, createdAt: new Date() },
      { name: "MILTON", number: "7241", address: "", active: true, createdAt: new Date() },
      { name: "PEMBROKE", number: "7242", address: "", active: true, createdAt: new Date() },
      { name: "HUNTSVILLE", number: "7244", address: "", active: true, createdAt: new Date() },
      { name: "REGINA (NORTH)", number: "7245", address: "", active: true, createdAt: new Date() },
      { name: "MIDLAND", number: "7247", address: "", active: true, createdAt: new Date() },
      { name: "EDMONTON EAST (WHITEMUD)", number: "7248", address: "", active: true, createdAt: new Date() },
      { name: "WHITBY NORTH", number: "7249", address: "", active: true, createdAt: new Date() },
      { name: "CALGARY (TUSCANY)", number: "7250", address: "", active: true, createdAt: new Date() },
      { name: "COBOURG", number: "7251", address: "", active: true, createdAt: new Date() },
      { name: "WEST BANK", number: "7252", address: "", active: true, createdAt: new Date() },
      { name: "VAUGHAN", number: "7253", address: "", active: true, createdAt: new Date() },
      { name: "AIRDRIE", number: "7254", address: "", active: true, createdAt: new Date() },
      { name: "CRANBROOK", number: "7255", address: "", active: true, createdAt: new Date() },
      { name: "HAMILTON MOUNTAIN", number: "7256", address: "", active: true, createdAt: new Date() },
      { name: "DARTMOUTH CROSSINGS", number: "7257", address: "", active: true, createdAt: new Date() },
      { name: "LLOYDMINSTER", number: "7258", address: "", active: true, createdAt: new Date() },
      { name: "VANCOUVER CAMBIE", number: "7259", address: "", active: true, createdAt: new Date() },
      { name: "NEW MINAS", number: "7261", address: "", active: true, createdAt: new Date() },
      { name: "MARKHAM NORTH", number: "7262", address: "", active: true, createdAt: new Date() },
      { name: "CARLETON", number: "7263", address: "", active: true, createdAt: new Date() },
      { name: "BRADFORD", number: "7264", address: "", active: true, createdAt: new Date() },
      { name: "SASKATOON SOUTH", number: "7265", address: "", active: true, createdAt: new Date() },
      { name: "POINTE-CLAIRE", number: "7266", address: "", active: true, createdAt: new Date() },
      { name: "EDMONTON WINDERMERE", number: "7268", address: "", active: true, createdAt: new Date() },
      { name: "BOLTON", number: "7269", address: "", active: true, createdAt: new Date() },
      { name: "DUNCAN", number: "7272", address: "", active: true, createdAt: new Date() },
      { name: "CHILLIWACK", number: "7273", address: "", active: true, createdAt: new Date() },
      { name: "BRAMPTON WEST", number: "7301", address: "", active: true, createdAt: new Date() }
    ];

    // Service Providers Data
    const serviceProviders = [
      {
        name: "1000261598 ONTARIO INC. O/A BORTS HEATING & COOLING",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "12811197 CANADA INC. O/A BERGERON MECHANICAL",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "1504364 BC LTD DBA BLUE FLAME HEATING AND COOLING",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "2193826 ALBERTA LTD. O/A ATMOSPHERE PLUMBING AND HEATING",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "4 SEASONS HEATING, COOLING & ELECTRICAL",
        active: true,
        createdAt: new Date(),
      },
      { name: "4 SEASONS HOME COMFORT", active: true, createdAt: new Date() },
      {
        name: "9494 -1275 QUEBEC INC. 0/A THERMO CONFORT LD",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "A PLUS AIR SYSTEMS - ST. CATHERINES",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "A PLUS AIR SYSTEMS INC - TORONTO",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "AFFORDABLE COMFORT HEATING & COOLING",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "AYOTTE PLUMBING, HEATING & AIR CONDITIONING",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "BRIGHT PLUMBING HEATING AND ELECTRIC LTD.",
        active: true,
        createdAt: new Date(),
      },
      { name: "BUTTONS HEATING INC", active: true, createdAt: new Date() },
      {
        name: "CAMBRIDGE HEATING AND COOLING",
        active: true,
        createdAt: new Date(),
      },
      { name: "CLIMAT NORD SUD", active: true, createdAt: new Date() },
      { name: "CLIMCÔ SERVICE INC.", active: true, createdAt: new Date() },
      { name: "CONFORT RIVE-NORD INC.", active: true, createdAt: new Date() },
      {
        name: "CUSTOM AIR CONDITIONING LTD",
        active: true,
        createdAt: new Date(),
      },
      { name: "DIRECT BUY FURNACE", active: true, createdAt: new Date() },
      { name: "E.N. BLUE LTD", active: true, createdAt: new Date() },
      {
        name: "ENERGY CLEAN HOME SERVICES INC",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "EVEREST CLIMATE SOLUTIONS INC.",
        active: true,
        createdAt: new Date(),
      },
      { name: "FRIESEN'S EDMONTON", active: true, createdAt: new Date() },
      {
        name: "FURNACE FACTORY DIRECT INC",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "FURNACE KING HOME SERVICES",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "GANTER PLUMBING AND HEATING LTD.",
        active: true,
        createdAt: new Date(),
      },
      { name: "GASTECH SOLUTIONS INC.", active: true, createdAt: new Date() },
      {
        name: "GROUPE CHRISTIAN GOSSELIN ESTRIE",
        active: true,
        createdAt: new Date(),
      },
      { name: "GROUPE PRO-ZONE INC.", active: true, createdAt: new Date() },
      {
        name: "HARMONY HEATING AND AIR CONDITIONING INC",
        active: true,
        createdAt: new Date(),
      },
      { name: "HEAT TECH", active: true, createdAt: new Date() },
      { name: "HOME SAVING INC.", active: true, createdAt: new Date() },
      { name: "IDEAL HOME COMFORT", active: true, createdAt: new Date() },
      {
        name: "KOOTENAY COOLING & HEATING",
        active: true,
        createdAt: new Date(),
      },
      { name: "LAMBERTS HVAC LTD", active: true, createdAt: new Date() },
      {
        name: "LANCASTER HEATING AND COOLING INC.",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "LANGEMANN HEATING & COOLING",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "LES INDUSTRIES GARANTIES LTEE",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "LES SYSTEMES TECHNO-POMPES INC.",
        active: true,
        createdAt: new Date(),
      },
      { name: "LG HOME COMFORT INC.", active: true, createdAt: new Date() },
      {
        name: "MCCANCE PLUMBING & HEATING",
        active: true,
        createdAt: new Date(),
      },
      { name: "MF CONFORT INC", active: true, createdAt: new Date() },
      {
        name: "NATIONAL ENERGY EQUIPMENT ",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "NEWELL HEATING AND SHEET METAL",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "NIMKA INC. ULTRA BUILT-IN SYSTEMS",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "NORTH CHANNEL HEATING & AIR CONDITIONING",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "ONPOINT HOME SERVICES INC",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "PLUMBING & HEATING PARAMEDICS INC.",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "POSTMA HEATING AND COOLING INC.",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "PRESTON HEATING & AIR CONDITIONING",
        active: true,
        createdAt: new Date(),
      },
      { name: "QUALITE D'AIR OUTAOUAIS", active: true, createdAt: new Date() },
      {
        name: "QUARTZ REFRIGERATION INC.",
        active: true,
        createdAt: new Date(),
      },
      { name: "R & G LEGAULT INC", active: true, createdAt: new Date() },
      {
        name: "R/T HEATING & AIR CONDITIONING LTD.",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "SCOTT’S R & S HEATING SYSTEMS INC",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "SERVICE PLUS PLUMBING AND HEATING",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "SOUTH FRASER HEATING AND COOLING LTD.",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "SUNRISE HEATING AND COOLING LTD.",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "TBA HEATING, COOLING AND CONSTRUCTION INC",
        active: true,
        createdAt: new Date(),
      },
      { name: "THE FURNACE ROOM INC", active: true, createdAt: new Date() },
      {
        name: "TOSHACK SERVICE & MAINTENANCE CORP.",
        active: true,
        createdAt: new Date(),
      },
      { name: "VIS ELECTRICAL LTD.", active: true, createdAt: new Date() },
      { name: "WAGNER HEATING & AIR LTD", active: true, createdAt: new Date() },
      { name: "WEATHER ON DEMAND INC.", active: true, createdAt: new Date() },
      {
        name: "WESTERN CANADIAN FURNACE COMPANY",
        active: true,
        createdAt: new Date(),
      },
      { name: "YEG HOME COMFORT LTD.", active: true, createdAt: new Date() },
      {
        name: "ZERO-C/CLIMAT-CONTROL SB INC",
        active: true,
        createdAt: new Date(),
      },
    ];

    // Insert Territory Managers
    console.log("📝 Inserting Territory Managers...");
    const tmCollection = db.collection("territory-managers");

    // Clear existing data
    await tmCollection.deleteMany({});

    // Insert new data
    const tmResult = await tmCollection.insertMany(territoryManagers);
    console.log(`✅ Inserted ${tmResult.insertedCount} territory managers`);

    // Insert Stores
    console.log("📝 Inserting Stores...");
    const storesCollection = db.collection("stores");

    // Clear existing data
    await storesCollection.deleteMany({});

    // Insert new data
    const storesResult = await storesCollection.insertMany(stores);
    console.log(`✅ Inserted ${storesResult.insertedCount} stores`);

    // Insert Service Providers
    console.log("📝 Inserting Service Providers...");
    const spCollection = db.collection("service-providers");

    // Clear existing data
    await spCollection.deleteMany({});

    // Insert new data
    const spResult = await spCollection.insertMany(serviceProviders);
    console.log(`✅ Inserted ${spResult.insertedCount} service providers`);

    console.log("");
    console.log("🎉 Database populated successfully!");
    console.log("");
    console.log("📊 Summary:");
    console.log(`   Territory Managers: ${tmResult.insertedCount}`);
    console.log(`   Stores: ${storesResult.insertedCount}`);
    console.log(`   Service Providers: ${spResult.insertedCount}`);
    console.log("");
    console.log(
      "💡 You can now add/edit/remove items directly in MongoDB and they will appear in your form automatically!",
    );

    await client.close();
    console.log("🔒 Database connection closed");
  } catch (error) {
    console.error("❌ Error populating database:", error);
  }
}

// Run the population script
populateDropdownData();
