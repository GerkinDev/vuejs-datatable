
Vue.config.debug = true;
Vue.config.devtools = true;

Vue.component('profile', {
	template: `
		<span>
			<a href="#">Profile Page</a>
		</span>
	`,
	props: ['row'],
	asPlainText: function(row){
		return row.user.username;
	}
});

Vue.component('projects', {
	template: `
		<span>
			<a href="#">Projects</a>
		</span>
	`,
	props: ['row']
});

var vm = new Vue({
	el: '.container',
	data: {
		columns: [
			{label: 'ID', field: 'id', align: 'center', filterable: false},
			{label: 'Username', field: 'user.username'},
			{label: 'First Name', field: 'user.first_name'},
			{label: 'Last Name', field: 'user.last_name'},
			{label: 'Email', field: 'user.email', align: 'right', sortable: false},
			{label: 'Address', callback: function(row){
				return row.address + ', ' + row.city + ', ' + row.state;
			}, align: 'right', sortable: false},
			{label: 'Projects', component: 'projects'},
			{label: 'Profile', component: 'profile'}
		],
		rows: [
			{
			  "id": 1,
			  "user": {
			  	"username": "dprice0",
			    "first_name": "Daniel",
			    "last_name": "Price",
			    "email": "dprice0@blogs.com"
			  },
			  "address": "3 Toban Park",
			  "city": "Pocatello",
			  "state": "Idaho"
			}, {
			  "id": 2,
			  "user": {
			  	"username": "dgreen1",
			    "first_name": "Doris",
			    "last_name": "Green",
			    "email": "dgreen1@elpais.com"
			  },
			  "address": "4210 Portage Trail",
			  "city": "Mobile",
			  "state": "Alabama"
			}, {
			  "id": 3,
			  "user": {
			  	"username": "njohnston2",
			    "first_name": "Nicholas",
			    "last_name": "Johnston",
			    "email": "njohnston2@tiny.cc"
			  },
			  "address": "94 Hanson Trail",
			  "city": "Brooklyn",
			  "state": "New York"
			}, {
			  "id": 4,
			  "user": {
			  	"username": "rlee3",
			    "first_name": "Ronald",
			    "last_name": "Lee",
			    "email": "rlee3@shareasale.com"
			  },
			  "address": "54915 Ludington Park",
			  "city": "Salt Lake City",
			  "state": "Utah"
			}, {
			  "id": 5,
			  "user": {
			  	"username": "jcox4",
			    "first_name": "Jose",
			    "last_name": "Cox",
			    "email": "jcox4@sitemeter.com"
			  },
			  "address": "9 South Parkway",
			  "city": "Glendale",
			  "state": "Arizona"
			}, {
			  "id": 6,
			  "user": {
			  	"username": "eward5",
			    "first_name": "Ernest",
			    "last_name": "Ward",
			    "email": "eward5@imageshack.us"
			  },
			  "address": "72 Shelley Plaza",
			  "city": "Whittier",
			  "state": "California"
			}, {
			  "id": 7,
			  "user": {
			  	"username": "phall6",
			    "first_name": "Patrick",
			    "last_name": "Hall",
			    "email": "phall6@github.com"
			  },
			  "address": "27773 Orin Hill",
			  "city": "Fort Lauderdale",
			  "state": "Florida"
			}, {
			  "id": 8,
			  "user": {
			  	"username": "lnichols7",
			    "first_name": "Lawrence",
			    "last_name": "Nichols",
			    "email": "lnichols7@home.pl"
			  },
			  "address": "03444 Harbort Trail",
			  "city": "Syracuse",
			  "state": "New York"
			}, {
			  "id": 9,
			  "user": {
			  	"username": "hperkins8",
			    "first_name": "Heather",
			    "last_name": "Perkins",
			    "email": "hperkins8@addtoany.com"
			  },
			  "address": "1086 Myrtle Pass",
			  "city": "White Plains",
			  "state": "New York"
			}, {
			  "id": 10,
			  "user": {
			  	"username": "jwoods9",
			    "first_name": "Jonathan",
			    "last_name": "Woods",
			    "email": "jwoods9@blogs.com"
			  },
			  "address": "5697 Leroy Street",
			  "city": "Akron",
			  "state": "Ohio"
			}, {
			  "id": 11,
			  "user": {
			  	"username": "nwelcha",
			    "first_name": "Nancy",
			    "last_name": "Welch",
			    "email": "nwelcha@so-net.ne.jp"
			  },
			  "address": "386 Sachs Terrace",
			  "city": "Tucson",
			  "state": "Arizona"
			}, {
			  "id": 12,
			  "user": {
			  	"username": "emillerb",
			    "first_name": "Eric",
			    "last_name": "Miller",
			    "email": "emillerb@chicagotribune.com"
			  },
			  "address": "7233 Melvin Center",
			  "city": "Pittsburgh",
			  "state": "Pennsylvania"
			}, {
			  "id": 13,
			  "user": {
			  	"username": "hallenc",
			    "first_name": "Heather",
			    "last_name": "Allen",
			    "email": "hallenc@ucoz.ru"
			  },
			  "address": "199 David Street",
			  "city": "Wichita",
			  "state": "Kansas"
			}, {
			  "id": 14,
			  "user": {
			  	"username": "wlittled",
			    "first_name": "Walter",
			    "last_name": "Little",
			    "email": "wlittled@goodreads.com"
			  },
			  "address": "9019 Truax Road",
			  "city": "Bakersfield",
			  "state": "California"
			}, {
			  "id": 15,
			  "user": {
			  	"username": "jthompsone",
			    "first_name": "Janice",
			    "last_name": "Thompson",
			    "email": "jthompsone@fotki.com"
			  },
			  "address": "4 Lillian Drive",
			  "city": "Cleveland",
			  "state": "Ohio"
			}, {
			  "id": 16,
			  "user": {
			  	"username": "kgeorgef",
			    "first_name": "Kathryn",
			    "last_name": "George",
			    "email": "kgeorgef@nydailynews.com"
			  },
			  "address": "0133 Northwestern Lane",
			  "city": "Pueblo",
			  "state": "Colorado"
			}, {
			  "id": 17,
			  "user": {
			  	"username": "blongg",
			    "first_name": "Brandon",
			    "last_name": "Long",
			    "email": "blongg@etsy.com"
			  },
			  "address": "22 Eliot Circle",
			  "city": "Baltimore",
			  "state": "Maryland"
			}, {
			  "id": 18,
			  "user": {
			  	"username": "rfreemanh",
			    "first_name": "Ryan",
			    "last_name": "Freeman",
			    "email": "rfreemanh@wp.com"
			  },
			  "address": "3010 Ridge Oak Junction",
			  "city": "Fort Worth",
			  "state": "Texas"
			}, {
			  "id": 19,
			  "user": {
			  	"username": "jpaynei",
			    "first_name": "Janet",
			    "last_name": "Payne",
			    "email": "jpaynei@tiny.cc"
			  },
			  "address": "630 Scoville Avenue",
			  "city": "Chula Vista",
			  "state": "California"
			}, {
			  "id": 20,
			  "user": {
			  	"username": "rfrazierj",
			    "first_name": "Rachel",
			    "last_name": "Frazier",
			    "email": "rfrazierj@last.fm"
			  },
			  "address": "16790 Oneill Court",
			  "city": "Midland",
			  "state": "Michigan"
			}, {
			  "id": 21,
			  "user": {
			  	"username": "kfloresk",
			    "first_name": "Kelly",
			    "last_name": "Flores",
			    "email": "kfloresk@cdbaby.com"
			  },
			  "address": "69 Bultman Place",
			  "city": "Albany",
			  "state": "New York"
			}, {
			  "id": 22,
			  "user": {
			  	"username": "ecarrl",
			    "first_name": "Eric",
			    "last_name": "Carr",
			    "email": "ecarrl@mysql.com"
			  },
			  "address": "71840 Miller Lane",
			  "city": "Portland",
			  "state": "Oregon"
			}, {
			  "id": 23,
			  "user": {
			  	"username": "faustinm",
			    "first_name": "Frank",
			    "last_name": "Austin",
			    "email": "faustinm@myspace.com"
			  },
			  "address": "5 Manley Plaza",
			  "city": "Bowie",
			  "state": "Maryland"
			}, {
			  "id": 24,
			  "user": {
			  	"username": "dlawrencen",
			    "first_name": "Diana",
			    "last_name": "Lawrence",
			    "email": "dlawrencen@mit.edu"
			  },
			  "address": "73 Swallow Center",
			  "city": "Minneapolis",
			  "state": "Minnesota"
			}, {
			  "id": 25,
			  "user": {
			  	"username": "jsimso",
			    "first_name": "Jason",
			    "last_name": "Sims",
			    "email": "jsimso@ucsd.edu"
			  },
			  "address": "0 Graedel Way",
			  "city": "Austin",
			  "state": "Texas"
			}, {
			  "id": 26,
			  "user": {
			  	"username": "dfosterp",
			    "first_name": "Denise",
			    "last_name": "Foster",
			    "email": "dfosterp@cbsnews.com"
			  },
			  "address": "0 Texas Parkway",
			  "city": "San Francisco",
			  "state": "California"
			}, {
			  "id": 27,
			  "user": {
			  	"username": "jbradleyq",
			    "first_name": "Joyce",
			    "last_name": "Bradley",
			    "email": "jbradleyq@smugmug.com"
			  },
			  "address": "10746 Grim Street",
			  "city": "Huntsville",
			  "state": "Texas"
			}, {
			  "id": 28,
			  "user": {
			  	"username": "ldunnr",
			    "first_name": "Lisa",
			    "last_name": "Dunn",
			    "email": "ldunnr@behance.net"
			  },
			  "address": "5 Upham Terrace",
			  "city": "Virginia Beach",
			  "state": "Virginia"
			}, {
			  "id": 29,
			  "user": {
			  	"username": "cfords",
			    "first_name": "Craig",
			    "last_name": "Ford",
			    "email": "cfords@addthis.com"
			  },
			  "address": "003 Dwight Pass",
			  "city": "Oklahoma City",
			  "state": "Oklahoma"
			}, {
			  "id": 30,
			  "user": {
			  	"username": "ljohnstont",
			    "first_name": "Lori",
			    "last_name": "Johnston",
			    "email": "ljohnstont@wisc.edu"
			  },
			  "address": "43 Logan Alley",
			  "city": "Wilkes Barre",
			  "state": "Pennsylvania"
			}, {
			  "id": 31,
			  "user": {
			  	"username": "agomezu",
			    "first_name": "Alice",
			    "last_name": "Gomez",
			    "email": "agomezu@narod.ru"
			  },
			  "address": "130 Derek Pass",
			  "city": "Arvada",
			  "state": "Colorado"
			}, {
			  "id": 32,
			  "user": {
			  	"username": "hphillipsv",
			    "first_name": "Harry",
			    "last_name": "Phillips",
			    "email": "hphillipsv@ox.ac.uk"
			  },
			  "address": "3633 Stoughton Hill",
			  "city": "Canton",
			  "state": "Ohio"
			}, {
			  "id": 33,
			  "user": {
			  	"username": "nwheelerw",
			    "first_name": "Nancy",
			    "last_name": "Wheeler",
			    "email": "nwheelerw@xing.com"
			  },
			  "address": "003 Dapin Pass",
			  "city": "Jamaica",
			  "state": "New York"
			}, {
			  "id": 34,
			  "user": {
			  	"username": "aberryx",
			    "first_name": "Alice",
			    "last_name": "Berry",
			    "email": "aberryx@prlog.org"
			  },
			  "address": "1725 Fair Oaks Crossing",
			  "city": "Rochester",
			  "state": "New York"
			}, {
			  "id": 35,
			  "user": {
			  	"username": "bdixony",
			    "first_name": "Beverly",
			    "last_name": "Dixon",
			    "email": "bdixony@state.gov"
			  },
			  "address": "924 Muir Court",
			  "city": "Rochester",
			  "state": "New York"
			}, {
			  "id": 36,
			  "user": {
			  	"username": "fricez",
			    "first_name": "Frances",
			    "last_name": "Rice",
			    "email": "fricez@chicagotribune.com"
			  },
			  "address": "8533 Lien Plaza",
			  "city": "Arlington",
			  "state": "Virginia"
			}, {
			  "id": 37,
			  "user": {
			  	"username": "kwoods10",
			    "first_name": "Kathleen",
			    "last_name": "Woods",
			    "email": "kwoods10@adobe.com"
			  },
			  "address": "28836 Hoard Trail",
			  "city": "Irvine",
			  "state": "California"
			}, {
			  "id": 38,
			  "user": {
			  	"username": "redwards11",
			    "first_name": "Robin",
			    "last_name": "Edwards",
			    "email": "redwards11@prweb.com"
			  },
			  "address": "77 Clyde Gallagher Pass",
			  "city": "Honolulu",
			  "state": "Hawaii"
			}, {
			  "id": 39,
			  "user": {
			  	"username": "jmartinez12",
			    "first_name": "Jimmy",
			    "last_name": "Martinez",
			    "email": "jmartinez12@pen.io"
			  },
			  "address": "49197 Cambridge Road",
			  "city": "Washington",
			  "state": "District of Columbia"
			}, {
			  "id": 40,
			  "user": {
			  	"username": "jrogers13",
			    "first_name": "Joan",
			    "last_name": "Rogers",
			    "email": "jrogers13@cafepress.com"
			  },
			  "address": "30 Gulseth Crossing",
			  "city": "Kansas City",
			  "state": "Missouri"
			}, {
			  "id": 41,
			  "user": {
			  	"username": "truiz14",
			    "first_name": "Thomas",
			    "last_name": "Ruiz",
			    "email": "truiz14@wordpress.com"
			  },
			  "address": "4 Forest Run Plaza",
			  "city": "Arlington",
			  "state": "Virginia"
			}, {
			  "id": 42,
			  "user": {
			  	"username": "hcole15",
			    "first_name": "Henry",
			    "last_name": "Cole",
			    "email": "hcole15@cdc.gov"
			  },
			  "address": "7 Burning Wood Hill",
			  "city": "Port Charlotte",
			  "state": "Florida"
			}, {
			  "id": 43,
			  "user": {
			  	"username": "cscott16",
			    "first_name": "Craig",
			    "last_name": "Scott",
			    "email": "cscott16@parallels.com"
			  },
			  "address": "95 Chive Alley",
			  "city": "Toledo",
			  "state": "Ohio"
			}, {
			  "id": 44,
			  "user": {
			  	"username": "pdaniels17",
			    "first_name": "Peter",
			    "last_name": "Daniels",
			    "email": "pdaniels17@ca.gov"
			  },
			  "address": "4 Kings Center",
			  "city": "Oklahoma City",
			  "state": "Oklahoma"
			}, {
			  "id": 45,
			  "user": {
			  	"username": "cburton18",
			    "first_name": "Craig",
			    "last_name": "Burton",
			    "email": "cburton18@eepurl.com"
			  },
			  "address": "55135 Toban Junction",
			  "city": "Athens",
			  "state": "Georgia"
			}, {
			  "id": 46,
			  "user": {
			  	"username": "dolson19",
			    "first_name": "Daniel",
			    "last_name": "Olson",
			    "email": "dolson19@answers.com"
			  },
			  "address": "78187 David Terrace",
			  "city": "Los Angeles",
			  "state": "California"
			}, {
			  "id": 47,
			  "user": {
			  	"username": "mscott1a",
			    "first_name": "Mark",
			    "last_name": "Scott",
			    "email": "mscott1a@boston.com"
			  },
			  "address": "1555 Ridgeview Way",
			  "city": "Hialeah",
			  "state": "Florida"
			}, {
			  "id": 48,
			  "user": {
			  	"username": "jthomas1b",
			    "first_name": "Jerry",
			    "last_name": "Thomas",
			    "email": "jthomas1b@bloomberg.com"
			  },
			  "address": "730 Sutteridge Parkway",
			  "city": "Washington",
			  "state": "District of Columbia"
			}, {
			  "id": 49,
			  "user": {
			  	"username": "twilliams1c",
			    "first_name": "Teresa",
			    "last_name": "Williams",
			    "email": "twilliams1c@nationalgeographic.com"
			  },
			  "address": "0 Melody Trail",
			  "city": "Minneapolis",
			  "state": "Minnesota"
			}, {
			  "id": 50,
			  "user": {
			  	"username": "flee1d",
			    "first_name": "Frances",
			    "last_name": "Lee",
			    "email": "flee1d@instagram.com"
			  },
			  "address": "4 Texas Hill",
			  "city": "Sacramento",
			  "state": "California"
			}, {
			  "id": 51,
			  "user": {
			  	"username": "khawkins1e",
			    "first_name": "Kathleen",
			    "last_name": "Hawkins",
			    "email": "khawkins1e@admin.ch"
			  },
			  "address": "852 Golf Terrace",
			  "city": "Dayton",
			  "state": "Ohio"
			}, {
			  "id": 52,
			  "user": {
			  	"username": "aboyd1f",
			    "first_name": "Anthony",
			    "last_name": "Boyd",
			    "email": "aboyd1f@va.gov"
			  },
			  "address": "0 Bonner Parkway",
			  "city": "Albuquerque",
			  "state": "New Mexico"
			}, {
			  "id": 53,
			  "user": {
			  	"username": "mholmes1g",
			    "first_name": "Michelle",
			    "last_name": "Holmes",
			    "email": "mholmes1g@i2i.jp"
			  },
			  "address": "1302 Brickson Park Trail",
			  "city": "Fort Myers",
			  "state": "Florida"
			}, {
			  "id": 54,
			  "user": {
			  	"username": "jhudson1h",
			    "first_name": "Jean",
			    "last_name": "Hudson",
			    "email": "jhudson1h@jigsy.com"
			  },
			  "address": "049 Atwood Plaza",
			  "city": "Denver",
			  "state": "Colorado"
			}, {
			  "id": 55,
			  "user": {
			  	"username": "rstevens1i",
			    "first_name": "Rachel",
			    "last_name": "Stevens",
			    "email": "rstevens1i@bravesites.com"
			  },
			  "address": "2623 Kipling Way",
			  "city": "Tucson",
			  "state": "Arizona"
			}, {
			  "id": 56,
			  "user": {
			  	"username": "abrooks1j",
			    "first_name": "Anne",
			    "last_name": "Brooks",
			    "email": "abrooks1j@sourceforge.net"
			  },
			  "address": "4 Clemons Parkway",
			  "city": "Lynchburg",
			  "state": "Virginia"
			}, {
			  "id": 57,
			  "user": {
			  	"username": "gharrison1k",
			    "first_name": "Gregory",
			    "last_name": "Harrison",
			    "email": "gharrison1k@walmart.com"
			  },
			  "address": "9 Westend Circle",
			  "city": "Birmingham",
			  "state": "Alabama"
			}, {
			  "id": 58,
			  "user": {
			  	"username": "pmarshall1l",
			    "first_name": "Phyllis",
			    "last_name": "Marshall",
			    "email": "pmarshall1l@over-blog.com"
			  },
			  "address": "4602 Springs Plaza",
			  "city": "Wilmington",
			  "state": "Delaware"
			}, {
			  "id": 59,
			  "user": {
			  	"username": "csims1m",
			    "first_name": "Craig",
			    "last_name": "Sims",
			    "email": "csims1m@cdbaby.com"
			  },
			  "address": "299 Cottonwood Trail",
			  "city": "Arlington",
			  "state": "Virginia"
			}, {
			  "id": 60,
			  "user": {
			  	"username": "cwillis1n",
			    "first_name": "Carl",
			    "last_name": "Willis",
			    "email": "cwillis1n@nih.gov"
			  },
			  "address": "94 Waxwing Junction",
			  "city": "New Orleans",
			  "state": "Louisiana"
			}, {
			  "id": 61,
			  "user": {
			  	"username": "mramirez1o",
			    "first_name": "Melissa",
			    "last_name": "Ramirez",
			    "email": "mramirez1o@surveymonkey.com"
			  },
			  "address": "3986 Hagan Drive",
			  "city": "Clearwater",
			  "state": "Florida"
			}, {
			  "id": 62,
			  "user": {
			  	"username": "hmitchell1p",
			    "first_name": "Helen",
			    "last_name": "Mitchell",
			    "email": "hmitchell1p@earthlink.net"
			  },
			  "address": "5 Commercial Way",
			  "city": "Los Angeles",
			  "state": "California"
			}, {
			  "id": 63,
			  "user": {
			  	"username": "agordon1q",
			    "first_name": "Albert",
			    "last_name": "Gordon",
			    "email": "agordon1q@mozilla.org"
			  },
			  "address": "000 Dunning Trail",
			  "city": "Memphis",
			  "state": "Tennessee"
			}, {
			  "id": 64,
			  "user": {
			  	"username": "kcollins1r",
			    "first_name": "Kevin",
			    "last_name": "Collins",
			    "email": "kcollins1r@mozilla.com"
			  },
			  "address": "6871 Sutherland Park",
			  "city": "Austin",
			  "state": "Texas"
			}, {
			  "id": 65,
			  "user": {
			  	"username": "djordan1s",
			    "first_name": "David",
			    "last_name": "Jordan",
			    "email": "djordan1s@dion.ne.jp"
			  },
			  "address": "390 Waywood Point",
			  "city": "Escondido",
			  "state": "California"
			}, {
			  "id": 66,
			  "user": {
			  	"username": "vkelley1t",
			    "first_name": "Virginia",
			    "last_name": "Kelley",
			    "email": "vkelley1t@jiathis.com"
			  },
			  "address": "94 Vernon Park",
			  "city": "Lansing",
			  "state": "Michigan"
			}, {
			  "id": 67,
			  "user": {
			  	"username": "jfisher1u",
			    "first_name": "Justin",
			    "last_name": "Fisher",
			    "email": "jfisher1u@wired.com"
			  },
			  "address": "6781 Dakota Lane",
			  "city": "Atlanta",
			  "state": "Georgia"
			}, {
			  "id": 68,
			  "user": {
			  	"username": "achapman1v",
			    "first_name": "Alan",
			    "last_name": "Chapman",
			    "email": "achapman1v@google.ca"
			  },
			  "address": "29 Evergreen Lane",
			  "city": "Seminole",
			  "state": "Florida"
			}, {
			  "id": 69,
			  "user": {
			  	"username": "jbell1w",
			    "first_name": "Jerry",
			    "last_name": "Bell",
			    "email": "jbell1w@google.es"
			  },
			  "address": "7826 Pearson Avenue",
			  "city": "New Orleans",
			  "state": "Louisiana"
			}, {
			  "id": 70,
			  "user": {
			  	"username": "ndixon1x",
			    "first_name": "Norma",
			    "last_name": "Dixon",
			    "email": "ndixon1x@upenn.edu"
			  },
			  "address": "584 Vera Drive",
			  "city": "Grand Rapids",
			  "state": "Michigan"
			}, {
			  "id": 71,
			  "user": {
			  	"username": "efreeman1y",
			    "first_name": "Evelyn",
			    "last_name": "Freeman",
			    "email": "efreeman1y@4shared.com"
			  },
			  "address": "3947 Atwood Trail",
			  "city": "Des Moines",
			  "state": "Iowa"
			}, {
			  "id": 72,
			  "user": {
			  	"username": "hramirez1z",
			    "first_name": "Henry",
			    "last_name": "Ramirez",
			    "email": "hramirez1z@google.co.uk"
			  },
			  "address": "93467 Corry Point",
			  "city": "Jacksonville",
			  "state": "Florida"
			}, {
			  "id": 73,
			  "user": {
			  	"username": "tharper20",
			    "first_name": "Tammy",
			    "last_name": "Harper",
			    "email": "tharper20@msn.com"
			  },
			  "address": "72618 Mayer Crossing",
			  "city": "Worcester",
			  "state": "Massachusetts"
			}, {
			  "id": 74,
			  "user": {
			  	"username": "brobertson21",
			    "first_name": "Benjamin",
			    "last_name": "Robertson",
			    "email": "brobertson21@fc2.com"
			  },
			  "address": "50 Fairview Plaza",
			  "city": "Newark",
			  "state": "New Jersey"
			}, {
			  "id": 75,
			  "user": {
			  	"username": "aedwards22",
			    "first_name": "Annie",
			    "last_name": "Edwards",
			    "email": "aedwards22@bloglovin.com"
			  },
			  "address": "9679 Fulton Center",
			  "city": "Vero Beach",
			  "state": "Florida"
			}, {
			  "id": 76,
			  "user": {
			  	"username": "pwatkins23",
			    "first_name": "Pamela",
			    "last_name": "Watkins",
			    "email": "pwatkins23@mail.ru"
			  },
			  "address": "3 Hansons Point",
			  "city": "New York City",
			  "state": "New York"
			}, {
			  "id": 77,
			  "user": {
			  	"username": "jcox24",
			    "first_name": "Jason",
			    "last_name": "Cox",
			    "email": "jcox24@yellowbook.com"
			  },
			  "address": "340 Nova Junction",
			  "city": "San Antonio",
			  "state": "Texas"
			}, {
			  "id": 78,
			  "user": {
			  	"username": "aberry25",
			    "first_name": "Aaron",
			    "last_name": "Berry",
			    "email": "aberry25@forbes.com"
			  },
			  "address": "97 Sachtjen Circle",
			  "city": "Houston",
			  "state": "Texas"
			}, {
			  "id": 79,
			  "user": {
			  	"username": "ddaniels26",
			    "first_name": "Diane",
			    "last_name": "Daniels",
			    "email": "ddaniels26@weather.com"
			  },
			  "address": "2982 Everett Trail",
			  "city": "Pensacola",
			  "state": "Florida"
			}, {
			  "id": 80,
			  "user": {
			  	"username": "cjames27",
			    "first_name": "Carlos",
			    "last_name": "James",
			    "email": "cjames27@nasa.gov"
			  },
			  "address": "5087 Towne Road",
			  "city": "Albuquerque",
			  "state": "New Mexico"
			}, {
			  "id": 81,
			  "user": {
			  	"username": "psims28",
			    "first_name": "Paula",
			    "last_name": "Sims",
			    "email": "psims28@utexas.edu"
			  },
			  "address": "68433 Bay Point",
			  "city": "Chicago",
			  "state": "Illinois"
			}, {
			  "id": 82,
			  "user": {
			  	"username": "kpatterson29",
			    "first_name": "Keith",
			    "last_name": "Patterson",
			    "email": "kpatterson29@hp.com"
			  },
			  "address": "52873 Crescent Oaks Park",
			  "city": "Charlotte",
			  "state": "North Carolina"
			}, {
			  "id": 83,
			  "user": {
			  	"username": "jhughes2a",
			    "first_name": "Jason",
			    "last_name": "Hughes",
			    "email": "jhughes2a@fc2.com"
			  },
			  "address": "0397 Anhalt Road",
			  "city": "Athens",
			  "state": "Georgia"
			}, {
			  "id": 84,
			  "user": {
			  	"username": "gmatthews2b",
			    "first_name": "George",
			    "last_name": "Matthews",
			    "email": "gmatthews2b@unc.edu"
			  },
			  "address": "9538 Manitowish Trail",
			  "city": "Saint Joseph",
			  "state": "Missouri"
			}, {
			  "id": 85,
			  "user": {
			  	"username": "balexander2c",
			    "first_name": "Brian",
			    "last_name": "Alexander",
			    "email": "balexander2c@netlog.com"
			  },
			  "address": "7 Prentice Circle",
			  "city": "Lansing",
			  "state": "Michigan"
			}, {
			  "id": 86,
			  "user": {
			  	"username": "cruiz2d",
			    "first_name": "Carolyn",
			    "last_name": "Ruiz",
			    "email": "cruiz2d@bloomberg.com"
			  },
			  "address": "049 Graedel Street",
			  "city": "Saint Petersburg",
			  "state": "Florida"
			}, {
			  "id": 87,
			  "user": {
			  	"username": "pwallace2e",
			    "first_name": "Patrick",
			    "last_name": "Wallace",
			    "email": "pwallace2e@spotify.com"
			  },
			  "address": "67 John Wall Alley",
			  "city": "Pensacola",
			  "state": "Florida"
			}, {
			  "id": 88,
			  "user": {
			  	"username": "fdean2f",
			    "first_name": "Frances",
			    "last_name": "Dean",
			    "email": "fdean2f@kickstarter.com"
			  },
			  "address": "7 Hanover Point",
			  "city": "Tampa",
			  "state": "Florida"
			}, {
			  "id": 89,
			  "user": {
			  	"username": "cstewart2g",
			    "first_name": "Craig",
			    "last_name": "Stewart",
			    "email": "cstewart2g@marriott.com"
			  },
			  "address": "46538 Buhler Drive",
			  "city": "Fresno",
			  "state": "California"
			}, {
			  "id": 90,
			  "user": {
			  	"username": "jstone2h",
			    "first_name": "Joseph",
			    "last_name": "Stone",
			    "email": "jstone2h@newsvine.com"
			  },
			  "address": "14 Parkside Road",
			  "city": "Salt Lake City",
			  "state": "Utah"
			}, {
			  "id": 91,
			  "user": {
			  	"username": "amason2i",
			    "first_name": "Anne",
			    "last_name": "Mason",
			    "email": "amason2i@chicagotribune.com"
			  },
			  "address": "89654 Esch Park",
			  "city": "Salt Lake City",
			  "state": "Utah"
			}, {
			  "id": 92,
			  "user": {
			  	"username": "jdixon2j",
			    "first_name": "Johnny",
			    "last_name": "Dixon",
			    "email": "jdixon2j@umich.edu"
			  },
			  "address": "32777 Little Fleur Way",
			  "city": "New York City",
			  "state": "New York"
			}, {
			  "id": 93,
			  "user": {
			  	"username": "holiver2k",
			    "first_name": "Harold",
			    "last_name": "Oliver",
			    "email": "holiver2k@bigcartel.com"
			  },
			  "address": "3462 Eagle Crest Lane",
			  "city": "Kalamazoo",
			  "state": "Michigan"
			}, {
			  "id": 94,
			  "user": {
			  	"username": "dnichols2l",
			    "first_name": "Donald",
			    "last_name": "Nichols",
			    "email": "dnichols2l@blog.com"
			  },
			  "address": "51433 Westridge Park",
			  "city": "Worcester",
			  "state": "Massachusetts"
			}, {
			  "id": 95,
			  "user": {
			  	"username": "alarson2m",
			    "first_name": "Angela",
			    "last_name": "Larson",
			    "email": "alarson2m@hugedomains.com"
			  },
			  "address": "7 Pleasure Pass",
			  "city": "Southfield",
			  "state": "Michigan"
			}, {
			  "id": 96,
			  "user": {
			  	"username": "ajohnson2n",
			    "first_name": "Annie",
			    "last_name": "Johnson",
			    "email": "ajohnson2n@hibu.com"
			  },
			  "address": "560 Jenifer Avenue",
			  "city": "Miami",
			  "state": "Florida"
			}, {
			  "id": 97,
			  "user": {
			  	"username": "psanchez2o",
			    "first_name": "Pamela",
			    "last_name": "Sanchez",
			    "email": "psanchez2o@livejournal.com"
			  },
			  "address": "0 Meadow Valley Park",
			  "city": "Canton",
			  "state": "Ohio"
			}, {
			  "id": 98,
			  "user": {
			  	"username": "kramirez2p",
			    "first_name": "Kelly",
			    "last_name": "Ramirez",
			    "email": "kramirez2p@nyu.edu"
			  },
			  "address": "587 Sloan Street",
			  "city": "Philadelphia",
			  "state": "Pennsylvania"
			}, {
			  "id": 99,
			  "user": {
			  	"username": "swilliamson2q",
			    "first_name": "Scott",
			    "last_name": "Williamson",
			    "email": "swilliamson2q@clickbank.net"
			  },
			  "address": "17168 Gulseth Avenue",
			  "city": "Montgomery",
			  "state": "Alabama"
			}, {
			  "id": 100,
			  "user": {
			  	"username": "nelliott2r",
			    "first_name": "Nancy",
			    "last_name": "Elliott",
			    "email": "nelliott2r@naver.com"
			  },
			  "address": "32 Londonderry Alley",
			  "city": "Memphis",
			  "state": "Tennessee"
			}
		]
	}
});