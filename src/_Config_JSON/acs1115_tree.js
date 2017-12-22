export const acs1115 = {

    "mhi": {
        "varcode": "mhi",
        "verbose": "Median Household Income",
        "section": "Income",
        "table": "B19013",
        "expression": ["B19013001"],
        "type": "currency",
        "minval": "1",
        "mininc": "1",
        "usezeroasnull": "yes",
        "favtable": "Median Household Income",
        "favstyle": "jenks,7,mh1",
        "bg": "yes"
    },

    "mhv": {
        "varcode": "mhv",
        "verbose": "Median Home Value",
        "section": "Housing",
        "table": "B25077",
        "expression": ["B25077001"],
        "type": "currency",
        "minval": "1",
        "mininc": "1",
        "usezeroasnull": "yes",
        "favtable": "Median Home Value",
        "favstyle": "jenks,7,mh2",
        "bg": "yes"
    },

    "mfi": {
        "varcode": "mfi",
        "verbose": "Median Family Income",
        "section": "Income",
        "table": "B19113",
        "expression": ["B19113001"],
        "type": "currency",
        "minval": "1",
        "mininc": "1",
        "usezeroasnull": "yes",
        "favtable": "Median Family Income",
        "favstyle": "jenks,7,mh3",
        "bg": "yes"
    },

    "pci": {
        "varcode": "pci",
        "verbose": "Per Capita Income",
        "section": "Income",
        "table": "B19301",
        "expression": ["B19301001"],
        "type": "currency",
        "minval": "1",
        "mininc": "1",
        "usezeroasnull": "yes",
        "favtable": "Per Capita Income",
        "favstyle": "jenks,7,mh4",
        "bg": "yes"
    },

    "myb": {
        "varcode": "myb",
        "verbose": "Median Year Housing Unit Built",
        "section": "Housing",
        "table": "B25035",
        "expression": ["B25035001"],
        "type": "regular",
        "minval": "1939",
        "mininc": "1",
        "usezeroasnull": "yes",
        "favtable": "Median Year Built",
        "favstyle": "jenks,7,mh5",
        "bg": "yes"
    },

    "pop": {
        "varcode": "pop",
        "verbose": "Total Population",
        "section": "Population",
        "table": "B01001",
        "expression": ["B01001001"],
        "type": "number",
        "minval": "0",
        "mininc": "1",
        "usezeroasnull": "no",
        "favtable": "Basic Population (total)",
        "favstyle": "jenks,7,mh7",
        "bg": "yes"
    },

    "pcth": {
        "varcode": "pcth",
        "verbose": "Percent Hispanic",
        "section": "Race",
        "table": "B03002",
        "expression": ["B03002012", "/", "B03002001"],
        "type": "percent",
        "minval": "0",
        "mininc": ".01",
        "usezeroasnull": "no",
        "favtable": "Race-Ethnicity (percent)",
        "favstyle": "jenks,7,mh6",
        "bg": "yes"
    },

    "pctw": {
        "varcode": "pctw",
        "verbose": "Percent White",
        "section": "Race",
        "table": "B03002",
        "expression": ["B03002003", "/", "B03002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Race-Ethnicity (percent)",
        "favstyle": "jenks,7,mh8",
        "bg": "yes"
    },

    "pctb": {
        "varcode": "pctb",
        "verbose": "Percent Black",
        "section": "Race",
        "table": "B03002",
        "expression": ["B03002004", "/", "B03002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Race-Ethnicity (percent)",
        "favstyle": "jenks,7,mh9",
        "bg": "yes"
    },

    "pctna": {
        "varcode": "pctna",
        "verbose": "Percent Native American",
        "section": "Race",
        "table": "B03002",
        "expression": ["B03002005", "/", "B03002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Race-Ethnicity (percent)",
        "favstyle": "jenks,7,sh1",
        "bg": "yes"
    },

    "pctasian": {
        "varcode": "pctasian",
        "verbose": "Percent Asian",
        "section": "Race",
        "table": "B03002",
        "expression": ["B03002006", "/", "B03002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Race-Ethnicity (percent)",
        "favstyle": "jenks,7,sh2",
        "bg": "yes"
    },

    "pcthaw": {
        "varcode": "pcthaw",
        "verbose": "Percent Hawaiian & PacIs",
        "section": "Race",
        "table": "B03002",
        "expression": ["B03002007", "/", "B03002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Race-Ethnicity (percent)",
        "favstyle": "jenks,7,sh4",
        "bg": "yes"
    },

    "pctmale": {
        "varcode": "pctmale",
        "verbose": "Percent Male",
        "section": "Population",
        "table": "B01001",
        "expression": ["B01001002", "/", "B01001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Male & Female (percent)",
        "favstyle": "jenks,7,sh6",
        "bg": "yes"
    },

    "pctfemale": {
        "varcode": "pctfemale",
        "verbose": "Percent Female",
        "section": "Population",
        "table": "B01001",
        "expression": ["B01001026", "/", "B01001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Male & Female (percent)",
        "favstyle": "jenks,7,sh5",
        "bg": "yes"
    },

    "ageless10": {
        "varcode": "ageless10",
        "verbose": "Percent Age Less Than 10",
        "section": "Age",
        "table": "B01001",
        "expression": ["(", "B01001003", "+", "B01001004", "+", "B01001027", "+", "B01001028", ")", "/", "B01001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Age Group (percent)",
        "favstyle": "jenks,7,mh1",
        "bg": "yes"
    },

    "ageless18": {
        "varcode": "ageless18",
        "verbose": "Percent Age Less Than 18",
        "section": "Age",
        "table": "B01001",
        "expression": ["(", "B01001003", "+", "B01001004", "+", "B01001027", "+", "B01001028", "+", "B01001005", "+", "B01001006", "+", "B01001029", "+", "B01001030", ")", "/", "B01001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Age Group (percent)",
        "favstyle": "jenks,7,mh2",
        "bg": "yes"
    },

    "age18to24": {
        "varcode": "age18to24",
        "verbose": "Percent Age 18 to 24",
        "section": "Age",
        "table": "B01001",
        "expression": ["(", "B01001007", "+", "B01001008", "+", "B01001009", "+", "B01001010", "+", "B01001031", "+", "B01001032", "+", "B01001033", "+", "B01001034", ")", "/", "B01001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Age Group (percent)",
        "favstyle": "jenks,7,mh3",
        "bg": "yes"
    },

    "age25to34": {
        "varcode": "age25to34",
        "verbose": "Percent Age 25 to 34",
        "section": "Age",
        "table": "B01001",
        "expression": ["(", "B01001011", "+", "B01001012", "+", "B01001035", "+", "B01001036", ")", "/", "B01001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Age Group (percent)",
        "favstyle": "jenks,7,mh4",
        "bg": "yes"
    },

    "age35to44": {
        "varcode": "age35to44",
        "verbose": "Percent Age 35 to 44",
        "section": "Age",
        "table": "B01001",
        "expression": ["(", "B01001013", "+", "B01001014", "+", "B01001037", "+", "B01001038", ")", "/", "B01001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Age Group (percent)",
        "favstyle": "jenks,7,mh5",
        "bg": "yes"
    },

    "age45to64": {
        "varcode": "age45to64",
        "verbose": "Percent Age 45 to 64",
        "section": "Age",
        "table": "B01001",
        "expression": ["(", "B01001015", "+", "B01001016", "+", "B01001017", "+", "B01001018", "+", "B01001019", "+", "B01001039", "+", "B01001040", "+", "B01001041", "+", "B01001042", "+", "B01001043", ")", "/", "B01001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Age Group (percent)",
        "favstyle": "jenks,7,mh6",
        "bg": "yes"
    },

    "age65plus": {
        "varcode": "age65plus",
        "verbose": "Percent Age 65 Plus",
        "section": "Age",
        "table": "B01001",
        "expression": ["(", "B01001020", "+", "B01001021", "+", "B01001022", "+", "B01001023", "+", "B01001024", "+", "B01001025", "+", "B01001044", "+", "B01001045", "+", "B01001046", "+", "B01001047", "+", "B01001048", "+", "B01001049", ")", "/", "B01001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Age Group (percent)",
        "favstyle": "jenks,7,mh7",
        "bg": "yes"
    },

    "medianage": {
        "varcode": "medianage",
        "verbose": "Median Age",
        "section": "Age",
        "table": "B01002",
        "expression": ["B01002001"],
        "type": "number",
        "minval": "1",
        "mininc": "0.1",
        "usezeroasnull": "yes",
        "favtable": "Median Age",
        "favstyle": "jenks,7,mh8",
        "bg": "yes"
    },

    "households": {
        "varcode": "households",
        "verbose": "Total Households",
        "section": "Household",
        "table": "B11001",
        "expression": ["B11001001"],
        "type": "number",
        "minval": "0",
        "mininc": "1",
        "usezeroasnull": "no",
        "favtable": "Household Type (total)",
        "favstyle": "jenks,7,mh9",
        "bg": "yes"
    },

    "familyhh": {
        "varcode": "familyhh",
        "verbose": "Percent Family Households",
        "section": "Household",
        "table": "B11001",
        "expression": ["B11001002", "/", "B11001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Household Type (total)",
        "favstyle": "jenks,7,mh10",
        "bg": "yes"
    },

    "nonfamhh": {
        "varcode": "nonfamhh",
        "verbose": "Percent Non Family Households",
        "section": "Household",
        "table": "B11001",
        "expression": ["B11001007", "/", "B11001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Household Type (total)",
        "favstyle": "jenks,7,mh11",
        "bg": "yes"
    },

    "housingun": {
        "varcode": "housingun",
        "verbose": "Total Housing Units",
        "section": "Housing",
        "table": "B25002",
        "expression": ["B25002001"],
        "type": "number",
        "minval": "0",
        "mininc": "1",
        "usezeroasnull": "no",
        "favtable": "Housing Units (total)",
        "favstyle": "jenks,7,mh12",
        "bg": "yes"
    },

    "occhu": {
        "varcode": "occhu",
        "verbose": "Percent Occupied Housing Units",
        "section": "Housing",
        "table": "B25002",
        "expression": ["B25002002", "/", "B25002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Occupancy (percent)",
        "favstyle": "jenks,7,sh1",
        "bg": "yes"
    },

    "vachu": {
        "varcode": "vachu",
        "verbose": "Percent Vacant Housing Units",
        "section": "Housing",
        "table": "B25002",
        "expression": ["B25002003", "/", "B25002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Occupancy (percent)",
        "favstyle": "jenks,7,sh2",
        "bg": "yes"
    },

    "owned": {
        "varcode": "owned",
        "verbose": "Percent Owner Occupied Housing Units",
        "section": "Housing",
        "table": "B25003",
        "expression": ["B25003002", "/", "B25003001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Tenure (percent)",
        "favstyle": "jenks,7,sh4",
        "bg": "yes"
    },

    "rented": {
        "varcode": "rented",
        "verbose": "Percent Renter Occupied Housing Units",
        "section": "Housing",
        "table": "B25003",
        "expression": ["B25003003", "/", "B25003001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Tenure (percent)",
        "favstyle": "jenks,7,sh5",
        "bg": "yes"
    },

    "nohsdipl": {
        "varcode": "nohsdipl",
        "verbose": "Percent No High School Diploma",
        "section": "Education",
        "table": "B15003",
        "expression": ["(", "B15003002", "+", "B15003003", "+", "B15003004", "+", "B15003005", "+", "B15003006", "+", "B15003007", "+", "B15003008", "+", "B15003009", "+", "B15003010", "+", "B15003011", "+", "B15003012", "+", "B15003013", "+", "B15003014", "+", "B15003015", "+", "B15003016", ")", "/", "B15003001", ")"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Educational Attainment (percent)",
        "favstyle": "jenks,7,sh6",
        "bg": "yes"
    },

    "hsgradsc": {
        "varcode": "hsgradsc",
        "verbose": "Percent High School Degree or Some College",
        "section": "Education",
        "table": "B15003",
        "expression": ["(", "B15003017", "+", "B15003018", "+", "B15003019", "+", "B15003020", "+", "B15003021", ")", "/", "B15003001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Educational Attainment (percent)",
        "favstyle": "jenks,7,mh1",
        "bg": "yes"
    },

    "bachlhghr": {
        "varcode": "bachlhghr",
        "verbose": "Percent Bachelors Degree or Higher",
        "section": "Education",
        "table": "B15003",
        "expression": ["(", "B15003022", "+", "B15003023", "+", "B15003024", "+", "B15003025", ")", "/", "B15003001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Educational Attainment (percent)",
        "favstyle": "jenks,7,mh2",
        "bg": "yes"
    },

    "medcrent": {
        "varcode": "medcrent",
        "verbose": "Median Contract Rent",
        "section": "Rent",
        "table": "B25058",
        "expression": ["B25058001"],
        "type": "currency",
        "minval": "1",
        "mininc": "1",
        "usezeroasnull": "yes",
        "favtable": "Median Contract Rent",
        "favstyle": "jenks,7,mh3",
        "bg": "yes"
    },

    "medgrent": {
        "varcode": "medgrent",
        "verbose": "Median Gross Rent",
        "section": "Rent",
        "table": "B25064",
        "expression": ["B25064001"],
        "type": "currency",
        "minval": "1",
        "mininc": "1",
        "usezeroasnull": "yes",
        "favtable": "Median Gross Rent",
        "favstyle": "jenks,7,mh4",
        "bg": "yes"
    },

    "citzbirth": {
        "varcode": "citzbirth",
        "verbose": "Percent US Citizen by Birth",
        "section": "Citizenship",
        "table": "B05001",
        "expression": ["(", "B05001002", "+", "B05001003", "+", "B05001004", ")", "/", "B05001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Citizenship (percent)",
        "favstyle": "jenks,7,mh5",
        "bg": "no"
    },

    "citznat": {
        "varcode": "citznat",
        "verbose": "Percent US Citizen by Naturalization",
        "section": "Citizenship",
        "table": "B05001",
        "expression": ["B05001005", "/", "B05001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Citizenship (percent)",
        "favstyle": "jenks,7,mh6",
        "bg": "no"
    },

    "notcitz": {
        "varcode": "notcitz",
        "verbose": "Percent Not a US Citizen",
        "section": "Citizenship",
        "table": "B05001",
        "expression": ["B05001006", "/", "B05001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Citizenship (percent)",
        "favstyle": "jenks,7,mh7",
        "bg": "no"
    },

    "borninsor": {
        "varcode": "borninsor",
        "verbose": "Percent US Native, Born in State of Residence",
        "section": "Birthplace",
        "table": "B05002",
        "expression": ["B05002003", "/", "B05002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Birthplace (percent)",
        "favstyle": "jenks,7,mh8",
        "bg": "no"
    },

    "bornothst": {
        "varcode": "bornothst",
        "verbose": "Percent US Native, Born in Another State",
        "section": "Birthplace",
        "table": "B05002",
        "expression": ["B05002004", "/", "B05002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Birthplace (percent)",
        "favstyle": "jenks,7,mh9",
        "bg": "no"
    },

    "nativeb": {
        "varcode": "nativeb",
        "verbose": "Percent US Native",
        "section": "Birthplace",
        "table": "B05002",
        "expression": ["B05002002", "/", "B05002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Birthplace (percent)",
        "favstyle": "jenks,7,mh10",
        "bg": "no"
    },

    "foreignb": {
        "varcode": "foreignb",
        "verbose": "Percent Foreign Born",
        "section": "Birthplace",
        "table": "B05002",
        "expression": ["B05002013", "/", "B05002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Birthplace (percent)",
        "favstyle": "jenks,7,mh11",
        "bg": "no"
    },

    "samehouse": {
        "varcode": "samehouse",
        "verbose": "Percent Did Not Move",
        "section": "Migration",
        "table": "B07003",
        "expression": ["B07003004", "/", "B07003001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Migration (percent)",
        "favstyle": "jenks,7,mh12",
        "bg": "no"
    },

    "samecnty": {
        "varcode": "samecnty",
        "verbose": "Percent Moved Within County",
        "section": "Migration",
        "table": "B07003",
        "expression": ["B07003007", "/", "B07003001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Migration (percent)",
        "favstyle": "jenks,7,sh1",
        "bg": "no"
    },

    "samestate": {
        "varcode": "samestate",
        "verbose": "Percent Moved from Different County Within State",
        "section": "Migration",
        "table": "B07003",
        "expression": ["B07003010", "/", "B07003001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Migration (percent)",
        "favstyle": "jenks,7,sh2",
        "bg": "no"
    },

    "diffstate": {
        "varcode": "diffstate",
        "verbose": "Percent Moved from Different State",
        "section": "Migration",
        "table": "B07003",
        "expression": ["B07003013", "/", "B07003001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Migration (percent)",
        "favstyle": "jenks,7,sh4",
        "bg": "no"
    },

    "frmabroad": {
        "varcode": "frmabroad",
        "verbose": "Percent Moved From Abroad",
        "section": "Migration",
        "table": "B07003",
        "expression": ["B07003016", "/", "B07003001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Migration (percent)",
        "favstyle": "jenks,7,sh5",
        "bg": "no"
    },

    "carall": {
        "varcode": "carall",
        "verbose": "Percent Drove a Car Truck or Van to Work",
        "section": "Transportation",
        "table": "B08006",
        "expression": ["B08006002", "/", "B08006001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Transportation to Work (percent)",
        "favstyle": "jenks,7,sh6",
        "bg": "no"
    },

    "usedpt": {
        "varcode": "usedpt",
        "verbose": "Percent Used Public Transportation",
        "section": "Transportation",
        "table": "B08006",
        "expression": ["B08006008", "/", "B08006001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Transportation to Work (percent)",
        "favstyle": "jenks,7,mh1",
        "bg": "no"
    },

    "bike": {
        "varcode": "bike",
        "verbose": "Percent Biked to Work",
        "section": "Transportation",
        "table": "B08006",
        "expression": ["B08006014", "/", "B08006001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Transportation to Work (percent)",
        "favstyle": "jenks,7,mh2",
        "bg": "no"
    },

    "walked": {
        "varcode": "walked",
        "verbose": "Percent Walked to Work",
        "section": "Transportation",
        "table": "B08006",
        "expression": ["B08006015", "/", "B08006001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Transportation to Work (percent)",
        "favstyle": "jenks,7,mh3",
        "bg": "no"
    },

    "home": {
        "varcode": "home",
        "verbose": "Percent Worked at Home",
        "section": "Transportation",
        "table": "B08006",
        "expression": ["B08006017", "/", "B08006001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Transportation to Work (percent)",
        "favstyle": "jenks,7,mh4",
        "bg": "no"
    },

    "avghhsize": {
        "varcode": "avghhsize",
        "verbose": "Average Household Size",
        "section": "Housing",
        "table": "B25010",
        "expression": ["B25010001"],
        "type": "number",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "yes",
        "favtable": "Average Household Size",
        "favstyle": "jenks,7,mh5",
        "bg": "yes"
    },

    "insured": {
        "varcode": "insured",
        "verbose": "Percent Insured",
        "section": "Insurance",
        "table": "B27001",
        "expression": ["(", "B27001004", "+", "B27001007", "+", "B27001010", "+", "B27001013", "+", "B27001016", "+", "B27001019", "+", "B27001022", "+", "B27001025", "+", "B27001028", "+", "B27001032", "+", "B27001035", "+", "B27001038", "+", "B27001041", "+", "B27001044", "+", "B27001047", "+", "B27001050", "+", "B27001053", "+", "B27001056", ")", "/", "B27001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Insurance (percent)",
        "favstyle": "jenks,7,mh7",
        "bg": "no"
    },

    "uninsured": {
        "varcode": "uninsured",
        "verbose": "Percent No Insurance",
        "section": "Insurance",
        "table": "B27001",
        "expression": ["(", "B27001005", "+", "B27001008", "+", "B27001011", "+", "B27001014", "+", "B27001017", "+", "B27001020", "+", "B27001023", "+", "B27001026", "+", "B27001029", "+", "B27001033", "+", "B27001036", "+", "B27001039", "+", "B27001042", "+", "B27001045", "+", "B27001048", "+", "B27001051", "+", "B27001054", "+", "B27001057", ")", "/", "B27001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Insurance (percent)",
        "favstyle": "jenks,7,mh8",
        "bg": "no"
    },

    "enrolled": {
        "varcode": "enrolled",
        "verbose": "Percent Enrolled in School",
        "section": "Education",
        "table": "B14001",
        "expression": ["B14001002", "/", "B14001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Enrolled in School (percent)",
        "favstyle": "jenks,7,mh9",
        "bg": "no"
    },

    "k8": {
        "varcode": "k8",
        "verbose": "Percent of Enrolled in K-8",
        "section": "Education",
        "table": "B14001",
        "expression": ["(", "B14001004", "+", "B14001005", "+", "B14001006", ")", "/", "B14001002"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Enrolled in School (percent)",
        "favstyle": "jenks,7,mh10",
        "bg": "no"
    },

    "enrhs": {
        "varcode": "enrhs",
        "verbose": "Percent of Enrolled in 9-12",
        "section": "Education",
        "table": "B14001",
        "expression": ["B14001007", "/", "B14001002"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Enrolled in School (percent)",
        "favstyle": "jenks,7,mh11",
        "bg": "no"
    },

    "enrcollege": {
        "varcode": "enrcollege",
        "verbose": "Percent of Enrolled in Colleges",
        "section": "Education",
        "table": "B14001",
        "expression": ["(", "B14001008", "+", "B14001009", ")", "/", "B14001002"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Enrolled in School (percent)",
        "favstyle": "jenks,7,mh12",
        "bg": "no"
    },

    "notenrolled": {
        "varcode": "notenrolled",
        "verbose": "Percent Not Enrolled in School",
        "section": "Education",
        "table": "B14001",
        "expression": ["B14001010", "/", "B14001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Enrolled in School (percent)",
        "favstyle": "jenks,7,sh1",
        "bg": "no"
    },

    "inpoverty": {
        "varcode": "inpoverty",
        "verbose": "Percent in Poverty",
        "section": "Poverty",
        "table": "C17002",
        "expression": ["(", "C17002002", "+", "C17002003", ")", "/", "C17002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Poverty (percent)",
        "favstyle": "jenks,7,sh2",
        "bg": "yes"
    },

    "inpov150": {
        "varcode": "inpov150",
        "verbose": "Percent Below 150% Poverty",
        "section": "Poverty",
        "table": "C17002",
        "expression": ["(", "C17002002", "+", "C17002003", "+", "C17002004", "+", "C17002005", ")", "/", "C17002001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Poverty (percent)",
        "favstyle": "jenks,7,sh4",
        "bg": "yes"
    },

    "disabled": {
        "varcode": "disabled",
        "verbose": "Percent Disabled",
        "section": "Disability",
        "table": "B18101",
        "expression": ["(", "B18101004", "+", "B18101007", "+", "B18101010", "+", "B18101013", "+", "B18101016", "+", "B18101019", "+", "B18101023", "+", "B18101026", "+", "B18101029", "+", "B18101032", "+", "B18101035", "+", "B18101038", ")", "/", "B18101001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Disability (percent)",
        "favstyle": "jenks,7,sh5",
        "bg": "no"
    },

    "unemp": {
        "varcode": "unemp",
        "verbose": "Percent Unemployed",
        "section": "Employment",
        "table": "B23025",
        "expression": ["B23025005", "/", "B23025002"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Unemployment (percent)",
        "favstyle": "jenks,7,sh6",
        "bg": "yes"
    },

    "armedforces": {
        "varcode": "armedforces",
        "verbose": "Percent of Labor Force in Armed Forces",
        "section": "Employment",
        "table": "B23025",
        "expression": ["B23025006", "/", "B23025002"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Unemployment (percent)",
        "favstyle": "jenks,7,mh1",
        "bg": "yes"
    },

    "realtaxes": {
        "varcode": "realtaxes",
        "verbose": "Median Real Estate Taxes Paid",
        "section": "Housing",
        "table": "B25103",
        "expression": ["B25103001"],
        "type": "currency",
        "minval": "1",
        "mininc": "1",
        "usezeroasnull": "yes",
        "favtable": "",
        "favstyle": "jenks,7,mh2",
        "bg": "no"
    },

    "moc_wmc": {
        "varcode": "moc_wmc",
        "verbose": "Median Monthly Owner Costs (w Mortgage)",
        "section": "Housing",
        "table": "B25088",
        "expression": ["B25088002"],
        "type": "currency",
        "minval": "1",
        "mininc": "1",
        "usezeroasnull": "yes",
        "favtable": "",
        "favstyle": "jenks,7,mh3",
        "bg": "yes"
    },

    "moc_nmc": {
        "varcode": "moc_nmc",
        "verbose": "Median Monthly Owner Costs (no Mortgage)",
        "section": "Housing",
        "table": "B25088",
        "expression": ["B25088003"],
        "type": "currency",
        "minval": "1",
        "mininc": "1",
        "usezeroasnull": "yes",
        "favtable": "",
        "favstyle": "jenks,7,mh4",
        "bg": "yes"
    },

    "hhalone": {
        "varcode": "hhalone",
        "verbose": "Pct of Households w Householder Living Alone",
        "section": "Household",
        "table": "B11001",
        "expression": ["B11001008", "/", "B11001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "",
        "favstyle": "jenks,7,mh5",
        "bg": "yes"
    },

    "hhnalone": {
        "varcode": "hhnalone",
        "verbose": "Pct of Households w Householder Not Living Alone",
        "section": "Household",
        "table": "B11001",
        "expression": ["B11001009", "/", "B11001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Household Type (total)",
        "favstyle": "jenks,7,mh6",
        "bg": "yes"
    },

    "mcfhh": {
        "varcode": "mcfhh",
        "verbose": "Percent Married Couple Family Households",
        "section": "Household",
        "table": "B11001",
        "expression": ["B11001003", "/", "B11001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Household Type (total)",
        "favstyle": "jenks,7,mh7",
        "bg": "yes"
    },

    "mhhnwphh": {
        "varcode": "mhhnwphh",
        "verbose": "Percent Male Householder, No Wife Present Households",
        "section": "Household",
        "table": "B11001",
        "expression": ["B11001005", "/", "B11001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Household Type (total)",
        "favstyle": "jenks,7,mh8",
        "bg": "yes"
    },

    "fhhnhphh": {
        "varcode": "fhhnhphh",
        "verbose": "Percent Female Householder, No Husband Present Households",
        "section": "Household",
        "table": "B11001",
        "expression": ["B11001006", "/", "B11001001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "Household Type (total)",
        "favstyle": "jenks,7,mh9",
        "bg": "yes"
    },

    "hhwchild": {
        "varcode": "hhwchild",
        "verbose": "Percent Households w Children Under 18 Present",
        "section": "Household",
        "table": "B11005",
        "expression": ["B11005002", "/", "B11005001"],
        "type": "percent",
        "minval": "0",
        "mininc": "0.01",
        "usezeroasnull": "no",
        "favtable": "",
        "favstyle": "jenks,7,mh10",
        "bg": "yes"
    },

    "cbhm": {
        "varcode": "cbhm",
        "verbose": "Cost Burdened Households (with a Mortgage)",
        "section": "Housing",
        "table": "B25101",
        "expression": ["(", "B25101006", "+", "B25101010", "+", "B25101014", "+", "B25101020", "+", "B25101022", ")", "/", "B25101002"],
        "type": "percent",
        "minval": "0",
        "mininc": ".01",
        "usezeroasnull": "no",
        "favtable": "Cost Burdened Households (with a Mortgage)",
        "favstyle": "jenks,7,cbhm",
        "bg": "yes"
    }
};
