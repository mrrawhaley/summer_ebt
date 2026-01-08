<script type="text/javascript">

    // globals
    var hh_income_levels = {};
    var income_strings = {};
    var selected_household_size = 0;

    function get_hh_size() {
        selected_household_size = document.getElementById("household_size").value;
    };

    function set_guidelines_visibility() {
        get_hh_size();
        if (selected_household_size > 0) {
            income_guidelines_table.style = "display: block; max-width: 30rem;";
            plain_language_guidelines.style = "display: block; max-width: 30rem;";
        } else {
            income_guidelines_table.style = "display: none";
            plain_language_guidelines.style = "display: none";
        };
    };

    const income_eligibility_guidelines = [
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 1, "income_frequency": "annually", "fpl": 185, "amount": 28953},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 1, "income_frequency": "monthly", "fpl": 185, "amount": 2413},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 1, "income_frequency": "twice per month", "fpl": 185, "amount": 1207},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 1, "income_frequency": "every two weeks", "fpl": 185, "amount": 1114},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 1, "income_frequency": "weekly", "fpl": 185, "amount": 557},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 2, "income_frequency": "annually", "fpl": 185, "amount": 39128},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 2, "income_frequency": "monthly", "fpl": 185, "amount": 3261},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 2, "income_frequency": "twice per month", "fpl": 185, "amount": 1631},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 2, "income_frequency": "every two weeks", "fpl": 185, "amount": 1505},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 2, "income_frequency": "weekly", "fpl": 185, "amount": 753},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 3, "income_frequency": "annually", "fpl": 185, "amount": 49303},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 3, "income_frequency": "monthly", "fpl": 185, "amount": 4109},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 3, "income_frequency": "twice per month", "fpl": 185, "amount": 2055},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 3, "income_frequency": "every two weeks", "fpl": 185, "amount": 1897},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 3, "income_frequency": "weekly", "fpl": 185, "amount": 949},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 4, "income_frequency": "annually", "fpl": 185, "amount": 59478},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 4, "income_frequency": "monthly", "fpl": 185, "amount": 4957},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 4, "income_frequency": "twice per month", "fpl": 185, "amount": 2479},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 4, "income_frequency": "every two weeks", "fpl": 185, "amount": 2288},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 4, "income_frequency": "weekly", "fpl": 185, "amount": 1144},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 5, "income_frequency": "annually", "fpl": 185, "amount": 69653},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 5, "income_frequency": "monthly", "fpl": 185, "amount": 5805},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 5, "income_frequency": "twice per month", "fpl": 185, "amount": 2903},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 5, "income_frequency": "every two weeks", "fpl": 185, "amount": 2679},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 5, "income_frequency": "weekly", "fpl": 185, "amount": 1340},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 6, "income_frequency": "annually", "fpl": 185, "amount": 79828},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 6, "income_frequency": "monthly", "fpl": 185, "amount": 6653},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 6, "income_frequency": "twice per month", "fpl": 185, "amount": 3327},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 6, "income_frequency": "every two weeks", "fpl": 185, "amount": 3071},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 6, "income_frequency": "weekly", "fpl": 185, "amount": 1536},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 7, "income_frequency": "annually", "fpl": 185, "amount": 90003},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 7, "income_frequency": "monthly", "fpl": 185, "amount": 7501},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 7, "income_frequency": "twice per month", "fpl": 185, "amount": 3751},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 7, "income_frequency": "every two weeks", "fpl": 185, "amount": 3462},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 7, "income_frequency": "weekly", "fpl": 185, "amount": 1731},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 8, "income_frequency": "annually", "fpl": 185, "amount": 100178},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 8, "income_frequency": "monthly", "fpl": 185, "amount": 8349},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 8, "income_frequency": "twice per month", "fpl": 185, "amount": 4175},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 8, "income_frequency": "every two weeks", "fpl": 185, "amount": 3853},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 8, "income_frequency": "weekly", "fpl": 185, "amount": 1927},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 9, "income_frequency": "annually", "fpl": 185, "amount": 110353},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 9, "income_frequency": "monthly", "fpl": 185, "amount": 9197},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 9, "income_frequency": "twice per month", "fpl": 185, "amount": 4599},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 9, "income_frequency": "every two weeks", "fpl": 185, "amount": 4245},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 9, "income_frequency": "weekly", "fpl": 185, "amount": 2123},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 10, "income_frequency": "annually", "fpl": 185, "amount": 120528},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 10, "income_frequency": "monthly", "fpl": 185, "amount": 10045},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 10, "income_frequency": "twice per month", "fpl": 185, "amount": 5023},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 10, "income_frequency": "every two weeks", "fpl": 185, "amount": 4637},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 10, "income_frequency": "weekly", "fpl": 185, "amount": 2319},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 11, "income_frequency": "annually", "fpl": 185, "amount": 130703},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 11, "income_frequency": "monthly", "fpl": 185, "amount": 10893},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 11, "income_frequency": "twice per month", "fpl": 185, "amount": 5447},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 11, "income_frequency": "every two weeks", "fpl": 185, "amount": 5029},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 11, "income_frequency": "weekly", "fpl": 185, "amount": 2515},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 12, "income_frequency": "annually", "fpl": 185, "amount": 140878},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 12, "income_frequency": "monthly", "fpl": 185, "amount": 11741},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 12, "income_frequency": "twice per month", "fpl": 185, "amount": 5871},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 12, "income_frequency": "every two weeks", "fpl": 185, "amount": 5421},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 12, "income_frequency": "weekly", "fpl": 185, "amount": 2711},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 13, "income_frequency": "annually", "fpl": 185, "amount": 151053},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 13, "income_frequency": "monthly", "fpl": 185, "amount": 12589},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 13, "income_frequency": "twice per month", "fpl": 185, "amount": 6295},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 13, "income_frequency": "every two weeks", "fpl": 185, "amount": 5813},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 13, "income_frequency": "weekly", "fpl": 185, "amount": 2907},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 14, "income_frequency": "annually", "fpl": 185, "amount": 161228},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 14, "income_frequency": "monthly", "fpl": 185, "amount": 13437},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 14, "income_frequency": "twice per month", "fpl": 185, "amount": 6719},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 14, "income_frequency": "every two weeks", "fpl": 185, "amount": 6205},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 14, "income_frequency": "weekly", "fpl": 185, "amount": 3103},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 15, "income_frequency": "annually", "fpl": 185, "amount": 171403},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 15, "income_frequency": "monthly", "fpl": 185, "amount": 14285},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 15, "income_frequency": "twice per month", "fpl": 185, "amount": 7143},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 15, "income_frequency": "every two weeks", "fpl": 185, "amount": 6597},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 15, "income_frequency": "weekly", "fpl": 185, "amount": 3299},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 16, "income_frequency": "annually", "fpl": 185, "amount": 181578},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 16, "income_frequency": "monthly", "fpl": 185, "amount": 15133},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 16, "income_frequency": "twice per month", "fpl": 185, "amount": 7567},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 16, "income_frequency": "every two weeks", "fpl": 185, "amount": 6989},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 16, "income_frequency": "weekly", "fpl": 185, "amount": 3495},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 17, "income_frequency": "annually", "fpl": 185, "amount": 191753},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 17, "income_frequency": "monthly", "fpl": 185, "amount": 15981},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 17, "income_frequency": "twice per month", "fpl": 185, "amount": 7991},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 17, "income_frequency": "every two weeks", "fpl": 185, "amount": 7381},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 17, "income_frequency": "weekly", "fpl": 185, "amount": 3691},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 18, "income_frequency": "annually", "fpl": 185, "amount": 201928},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 18, "income_frequency": "monthly", "fpl": 185, "amount": 16829},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 18, "income_frequency": "twice per month", "fpl": 185, "amount": 8415},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 18, "income_frequency": "every two weeks", "fpl": 185, "amount": 7773},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 18, "income_frequency": "weekly", "fpl": 185, "amount": 3887},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 19, "income_frequency": "annually", "fpl": 185, "amount": 212103},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 19, "income_frequency": "monthly", "fpl": 185, "amount": 17677},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 19, "income_frequency": "twice per month", "fpl": 185, "amount": 8839},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 19, "income_frequency": "every two weeks", "fpl": 185, "amount": 8165},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 19, "income_frequency": "weekly", "fpl": 185, "amount": 4083},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 20, "income_frequency": "annually", "fpl": 185, "amount": 222278},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 20, "income_frequency": "monthly", "fpl": 185, "amount": 18525},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 20, "income_frequency": "twice per month", "fpl": 185, "amount": 9263},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 20, "income_frequency": "every two weeks", "fpl": 185, "amount": 8557},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": 20, "income_frequency": "weekly", "fpl": 185, "amount": 4279},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": "additional", "income_frequency": "annually", "fpl": 185, "amount": 10175},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": "additional", "income_frequency": "monthly", "fpl": 185, "amount": 848},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": "additional", "income_frequency": "twice per month", "fpl": 185, "amount": 424},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": "additional", "income_frequency": "every two weeks", "fpl": 185, "amount": 392},
        {"year": "2025-2026", "place": "(not AK or HI)", "household_size": "additional", "income_frequency": "weekly", "fpl": 185, "amount": 196}
    ];

    function get_hh_income_levels() {
        get_hh_size();
        income_eligibility_guidelines.forEach((record) => {
            if (record.household_size == selected_household_size) {
                hh_income_levels[record.income_frequency] = record.amount;
            }
        })
    };

    function to_dollars(dollar_amount) {
        return dollar_amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
    };

    function stringify_income() {
        var income_frequencies = Object.keys(hh_income_levels);
        income_frequencies.forEach((frequency) => {
            var frequency_amount = to_dollars(hh_income_levels[frequency]);
            var frequency = frequency;
            income_strings[frequency] = `${frequency_amount} ${frequency}`;
            console.log(income_strings[frequency]);
        });
    };

    function fill_hh_income_table() {
        set_guidelines_visibility();
        get_hh_income_levels();
        stringify_income();
        document.getElementById("weekly").textContent = income_strings["weekly"];
        document.getElementById("every_two_weeks").textContent = income_strings["every two weeks"];
        document.getElementById("twice_per_month").textContent = income_strings["twice per month"];
        document.getElementById("monthly").textContent = income_strings["monthly"];
        document.getElementById("annually").textContent = income_strings["annually"];
    }

    function fill_plain_language_guidelines() {
        // The following functions should run from fill_hh_income_table():
        // set_guidelines_visibility();
        // get_hh_income_levels();
        // stringify_income();
        document.getElementById("plain_language_guidelines").innerHTML = `Your child/children may be eligible for Summer EBT if your household income is no more than ${income_strings["weekly"]}, ${income_strings["every two weeks"]}, ${income_strings["twice per month"]}, ${income_strings["monthly"]}, or ${income_strings["annually"]}.`
    };

    document.getElementById("household_size").addEventListener("change", fill_hh_income_table);
    document.getElementById("household_size").addEventListener("change", fill_plain_language_guidelines);

</script>
