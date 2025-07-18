// create languages variable - list of languages available for translation
let languages = ["en", "es"]

// create language_selector_label variable - label to prompt user to change language
let language_selector_label = {
    en: "Cambia idioma:",
    es: "Change language:"
};

// create question variable - JSON object with question text, answers, answer values, and answer types
let questions = {
    SCP: {
        question_text: {
            en: "Is your child enrolled in any of the following programs?",
            es: "¿Está su hijo inscrito en alguno de los siguientes programas?"
        },
        answers: {
            en: ["Supplemental Nutrition Assistance Program (SNAP)", "Medicaid", "Aid to Dependent Children (ADC)", "Food Distribution Program on Indian Reservations (FDPIR)", "My child is not enrolled in any of these programs", "I don't know"],
            es: ["SNAP (el Programa de Asistencia Nutrional Suplementaria)", "Medicaid", "ADC (Ayuda para Niños Dependientes/Aid to Dependent Children)", "FDPIR (Programa de Distribución de Alimentos para las Reservas Indígenas)", "Mi hijo no está inscrito en ninguno de estos programas", "No lo sé"]
        },
        answer_values: [1, 2, 1, 1, 0, 0],
        answer_type: "checkbox"
    },
    SCS: {
        question_text: {
            en: "Has your child been identified as any of the following?",
            es: "¿Se ha identificado a su hijo con alguna de las siguientes características?"
        },
        answers: {
            en: ["Students experiencing homelessness", "Children experiencing foster care", "Runaway", "My child has not been identified as any of these", "I don't know"],
            es: ["Un estudiante sin hogar", "En hogar de acogida", "Un estudiante fugitivo", "Mi hijo no ha sido identificado como ninguna de estas personas", "No lo sé"]
        },
        answer_values: [1, 1, 1, 0, 0],
        answer_type: "checkbox"
    },
    ACE: {
        question_text: {
            en: "Was your child born between January 1, 2004 and January 1, 2019?",
            es: "¿Su hijo nació entre el 1 de enero de 2004 y el 1 de enero de 2019?"
        },
        answers: {
            en: ["Yes", "No"],
            es: ["Sí", "No"]
        },
        answer_values: [1, 0],
        answer_type: "radio"
    },
    SCH: {
        question_text: {
            en: "Please select the school OR school district that your child attends. If you cannot find your child's school, look for your school district (for example, \"Omaha Public Schools\"). If your school or district isn't found on this list, they are not a school/district participating in the National School Lunch Program/School Breakfast Program, so unfortunately your child would not be eligible for this program.",
            es: "Por favor seleccione la escuela O el distrito escolar al que asiste su hijo/a. Si no encuentra la escuela de su hijo/a, busque su distrito escolar, por ejemplo, \"Omaha Public Schools\". Si su escuela o distrito no aparece en la lista, no participa en el Programa Nacional de Almuerzos Escolares/Programa de Desayunos Escolares, por lo que, lamentablemente, su hijo/a no sería elegible para este programa."
        },
        answers: {
            en: ["My child does not attend any of these schools", "My child is home schooled"],
            es: ["Mi hijo no asiste a ninguna de estas escuelas", "Mi hijo recibe educación en casa"]
            // en: ["(lookup list - NSLP)", "(lookup list - CEP)", "My child does not attend any of these schools", "My child is home schooled"],
            // es: ["(lookup list - NSLP)", "(lookup list - CEP)", "Mi hijo no asiste a ninguna de estas escuelas", "Mi hijo recibe educación en casa"]
        },
        answer_values: [0, 0],
        // answer_values: [1, 2, 0, 0],
        answer_type: "radio"
    },
    FRP: {
        question_text: {
            en: "Did you complete an application for free or reduced-price meals through your child's school/district <b>and</b> receive a letter from your child's school/district stating that your child was approved for free or reduced-price school meals for the 2024-2025 school year?",
            es: "¿Ha recibido una carta de la escuela o el distrito escolar de su hijo en la que se le informa que su hijo ha sido aprobado para recibir comidas escolares gratuitas o a precio reducido durante el año escolar 2024-2025?"
        },
        answers: {
            en: ["Yes", "No", "I don't know"],
            es: ["Sí", "No", "No lo sé"]
        },
        answer_values: [1, 0, 0],
        answer_type: "radio"
    },
    INS: {
        question_text: {
            en: "How many people are in your household?",
            es: "¿Cuántas personas viven en tu hogar?"
        },
        answers: {
            en: ["{ user input }"],
            es: ["{ user input }"]
        },
        answer_values: [],
        answer_type: "text"
    },
    INC: {
        question_text: {
            en: "Is your household income below { income eligibility threshold lookup for household size }?",
            es: "¿Los ingresos de su hogar son inferiores a { income eligibility threshold lookup for household size }?"
        },
        answers: {
            en: ["Yes", "No", "I don't know"],
            es: ["Sí", "No", "No lo sé"]
        },
        answer_values: [1, 0, 2],
        answer_type: "radio"
    }
};

// create income_frequencies variable - translations/transformations of income frequencies
let income_frequencies = {
    "annual": {
        en: "annually",
        es: "anualmente"
    },
    "monthly": {
        en: "monthly",
        es: "mensualmente"
    },
    "twice per month": {
        en: "twice per month",
        es: "dos veces al mes"
    },
    "every two weeks": {
        en: "every two weeks",
        es: "cada quincena"
    },
    "weekly": {
        en: "every week",
        es: "cada semana"
    }
}

// create school_input_warning_message variable - help message if school_input text does not match a school
let school_input_warning_message = {
    en: "Please select a school from the list.",
    es: "Por favor seleccione una escuela de la lista."
};

// create response_map variable - map of user responses to each question
let response_map = new Map();

// create outcome_map variable - map of outcomes for user responses
let outcome_map = new Map();

// create navigator_insertion variable - holds HTML element id of most recently inserted question to determine where to insert next question or message; initialized to start of navigator
var navigator_insertion = "question_navigator";

// create eligibility_determined variable - state of eligibilty determination
let eligibility_determined = false;

// create determination variable - eligibility determination
let determination = "";

// create selected_language variable - language selected by user in language selector input
let selected_language = "";

// create SEBT_year variable - use current date to determine which set of income eligibility guidelines to use; if current month is July through December, use guidelines for following year --> else, use guidelines for current year
// NOTE: getMonth() is zero-indexed
let SEBT_year;
let today = new Date();
let this_month = today.getMonth();
let this_year = today.getFullYear();
if (this_month >= 6) {
    SEBT_year = this_year.toString() + "-" + (this_year + 1).toString();
} else {
    SEBT_year = (this_year - 1).toString() + "-" + this_year.toString();
};

// create Question class
class Question {
    constructor(code, language, question, answers, answer_values, answer_type) {
        this.code = code;
        this.language = language;
        this.question = question;
        this.answers = answers;
        this.answer_values = answer_values;
        this.answer_type = answer_type;
    };

};

// placeholder_text - for school name input field
let placeholder_text = {
    en: "Click here and type the school name",
    es: "Haga clic aquí y escriba el nombre de la escuela"
};

// create Outcome class
class Outcome {
    constructor(code, language, outcome_text) {
        this.code = code;
        this.language = language,
        this.outcome_text = outcome_text;
    };
};

// create next_question_code - get what next question code should be; used to 
let next_question_code = "";

// create user_income_guidelines_string_by_lang variable - map of income strings by language
let user_income_guidelines_string_by_lang = {
    current: {
        en: "{ income eligibility threshold lookup for household size }",
        es: "{ income eligibility threshold lookup for household size }"
    },
    new: {
        en: "",
        es: ""
    }
};

let streamlined_cert_programs_selected = {
    SCP: {
        current: {
            en: "{ programs selected from question }",
            es: "{ programs selected from question }"
        },
        new: {
            en: "",
            es: ""
        }
    },
    SCS: {
        current: {
            en: "{ statuses selected from question }",
            es: "{ statuses selected from question }"
        },
        new: {
            en: "",
            es: ""
        }
    },
    
};

// create codes variable - holds question codes to facilitate mapping user input
const codes = ["SCP", "SCS", "ACE", "SCH", "FRP", "INS", "INC"];

// // create question_text variable - array of eligibility navigator questions; must replace income eligibility threshold language with dynamic lookup for guidelines based on household size input
// const question_text = {
//     en: ["Is your child enrolled in any of the following programs?", "Has your child been identified as any of the following?", "Since July 1, 2024, was your child between the ages of 6 and 18?", "Which school does your child attend?", "Did you complete and Education and Nutrition Benefits Application through your child's school <b>and</b> receive a letter from your child's school//district stating that your child was approved for free or reduced-price school meals for the 2024-2025 school year?", "How many people are in your household?", "Is your household income below { income eligibility threshold lookup for household size }?"],
//     es: ["¿Está su hijo inscrito en alguno de los siguientes programas?", "¿Se ha identificado a su hijo con alguna de las siguientes características?", "Desde el 1 de julio de 2024, ¿tenía su hijo entre 6 y 18 años?", "¿A qué colegio va tu hijo?", "¿Ha recibido una carta de la escuela o el distrito escolar de su hijo en la que se le informa que su hijo ha sido aprobado para recibir comidas escolares gratuitas o a precio reducido durante el año escolar 2024-2025?", "¿Cuántas personas viven en tu hogar?", "¿Los ingresos de su hogar son inferiores a {income eligibility threshold lookup for household size }?"]
// };

// // create answers variable - array of answer options for each variable; must replace school lookup list with list of schools/districts
// const answers = {
//     en: [["SNAP (FAP or food benefits)", "Medicaid (MA)", "TANF (FIP or cash assistance)", "My child is not enrolled in any of these programs", "I don't know"], ["Students experiencing homelessness", "Children experiencing foster care", "Migratory children", "Runaway", "My child has not been identified as any of these", "I don't know"], ["Yes", "No"], ["(lookup list - NSLP)", "(lookup list - CEP)", "My child does not attend any of these schools", "My child is home schooled"], ["Yes", "No", "I don't know"], ["{ user input }"], ["Yes", "No", "I don't know"]],
//     es: [["SNAP (FAP o el Programa de Asistencia Nutrional Suplementaria)", "Medicaid (MA)", "TANF (FIP o Ayuda para Niños Dependientes/Aid to Dependent Children)", "Mi hijo no está inscrito en ninguno de estos programas", "No lo sé"], ["Personas sin hogar", "Acogida", "Inmigrantes", "Fugitivo", "Mi hijo no ha sido identificado como ninguna de estas personas", "No lo sé"], ["Sí", "No"], ["(lookup list - NSLP)", "(lookup list - CEP)", "Mi hijo no asiste a ninguna de estas escuelas", "Mi hijo recibe educación en casa"], ["Sí", "No", "No lo sé"], ["{ user input }"], ["Sí", "No", "No lo sé"]]
// };

// create outcome_codes variable - holds outcome codes to facilitate displaying outcomes
const outcome_codes = ["mSCP", "mSCS", "mFRP", "mELI", "mUNK", "mNOT"];

// create outcome_messages variable - 
var outcomes = {
    mSCP: {
        en: "Your child should automatically receive Summer EBT benefits because of their enrollment in the following program(s): { programs selected from question }. *You should not have to apply* for benefits for your child.",
        es: "Su hijo debería recibir automáticamente los beneficios de Summer EBT debido a su inscripción en los siguientes programas: { programs selected from question }. *No es necesario que solicite* los beneficios para su hijo."
    },
    mSCS: {
        en: "Your child should automatically receive Summer EBT benefits because of their identification as the following: { statuses selected from question }. *You should not have to apply* for benefits for your child.",
        es: "Su hijo debería recibir automáticamente los beneficios del 6 debido a su identificación como: { statuses selected from question }. *No debería tener que solicitar* los beneficios para su hijo."
    },
    mFRP: {
        en: "Your child should automatically receive Summer EBT benefits because they were approved for free or reduced-price school meals. *You should not have to apply* for benefits for your child.",
        es: "Su hijo debería recibir automáticamente los beneficios de Summer EBT porque se le aprobaron las comidas escolares gratuitas o a precio reducido. *No es necesario que solicite* los beneficios para su hijo."
    },
    mELI: {
        en: "You should apply for Summer EBT benefits for your child. Based on your household income, your child should be eligible for Summer EBT benefits. <br/>  <br/> To fill out the application online, go to <a href=\"https://bit.ly/NE-SEBT-application\">https://bit.ly/NE-SEBT-application</a>.",
        es: "Debe solicitar los beneficios de EBT de verano para su hijo. Según los ingresos de su hogar, su hijo debería tener derecho a los beneficios de EBT de verano. \n\n Para rellenar la solicitud en línea, vaya a <a href=\"https://bit.ly/NE-SEBT-application\">https://bit.ly/NE-SEBT-application</a>."
    },
    mUNK: {
        en: "You may need to apply for Summer EBT benefits for your child. To be eligible, a child must meet one of the following requirements: <br/> 1) Be certified to receive free/reduced-price school meals *and* attend a school participating in the National School Lunch Program or School Breakfast Program, or <br/> 2) Be participating in Supplemental Nutrition Assistance Program (SNAP), Medicaid, Aid to Dependent Children (ADC), Food Distribution Program on Indian Reservations (FDPIR)  or identified as Homeless, Foster, Runaway *and* be between the ages of 5 and 18 or <br/> 3) Attend a school participating in the National School Lunch Program or School Breakfast Program *and* have a household income that meets the requirements for Summer EBT. <br/>  <br/> To fill out the application online, go to <a href=\"https://bit.ly/NE-SEBT-application\">https://bit.ly/NE-SEBT-application</a>.",
        es: "Es posible que tenga que solicitar los beneficios del Summer EBT para su hijo. Para ser elegible, el niño debe cumplir uno de los siguientes requisitos: \n\n 1) Estar certificado para recibir comidas escolares gratuitas o a precio reducido *y* asistir a una escuela que participe en el Programa Nacional de Almuerzos Escolares o en el Programa de Desayunos Escolares, o \n 2) Participar en SNAP (el Programa de Asistencia Nutrional Suplementaria), Medicaid, ADC (Ayuda para Niños Dependientes/Aid to Dependent Children), FDPIR (Programa de Distribución de Alimentos para las Reservas Indígenas) o estar identificado como persona sin hogar, en acogida de hogar, o fugitivo *y* tener entre 5 y 18 años, o \n 3) Asistir a una escuela que participe en el Programa Nacional de Almuerzos Escolares o el Programa de Desayunos Escolares *y* tener unos ingresos familiares que cumplan los requisitos para el Summer EBT. \n\n Para rellenar la solicitud en línea, vaya a <a href=\"https://bit.ly/NE-SEBT-application\">https://bit.ly/NE-SEBT-application</a>."
    },
    mNOT: {
        en: "Your child might not be eligible for Summer EBT but you should apply if you think your child is eligible. To be eligible, a child must meet one of the following requirements: <br/> 1) Be certified to receive free/reduced-price school meals *and* attend a school participating in the National School Lunch Program or School Breakfast Program, or <br/> 2) Be participating in Supplemental Nutrition Assistance Program (SNAP), Medicaid, Aid to Dependent Children (ADC), Food Distribution Program on Indian Reservations (FDPIR) or be identified as Homeless, Foster, Runaway *and* be between the ages of 5 and 18, or <br/> 3) Attend a school participating in the National School Lunch Program or School Breakfast Program *and* have a household income that meets the requirements for Summer EBT. <br/>  <br/> To fill out the application online, go to  <br/>  <a href=\"https://bit.ly/NE-SEBT-application\">https://bit.ly/NE-SEBT-application</a>.",
        es: "Es posible que su hijo no reúna los requisitos para recibir el Summer EBT, pero debe solicitarlo si cree que sí los reúne. Para ser elegible, el niño debe cumplir uno de los siguientes requisitos: \n\n 1) Estar certificado para recibir comidas escolares gratuitas o a precio reducido *y* asistir a una escuela que participe en el Programa Nacional de Almuerzos Escolares o en el Programa de Desayunos Escolares, o \n 2) Participar en SNAP (el Programa de Asistencia Nutrional Suplementaria), Medicaid, ADC (Ayuda para Niños Dependientes/Aid to Dependent Children), FDPIR (Programa de Distribución de Alimentos para las Reservas Indígenas) o estar identificado como persona sin hogar, en acogida de hogar, o fugitivo *y* tener entre 5 y 18 años, o \n 3) Asistir a una escuela que participe en el Programa Nacional de Almuerzos Escolares o el Programa de Desayunos Escolares *y* tener unos ingresos familiares que cumplan los requisitos para el Summer EBT. \n\n Para rellenar la solicitud en línea, vaya a <a href=\"https://bit.ly/NE-SEBT-application\">https://bit.ly/NE-SEBT-application</a>."
    }
};


// const outcome_messages = ["Your child should automatically receive Summer EBT benefits because of their enrollment in the following program(s): { programs selected from question }. *You should not have to apply* for benefits for your child.", "Your child should automatically receive Summer EBT benefits because of their identification as the following: { statuses selected from question }. *You should not have to apply* for benefits for your child.", "Your child should automatically receive Summer EBT benefits because they were approved for free or reduced-price school meals. *You should not have to apply* for benefits for your child.", "You should apply for Summer EBT benefits for your child. Based on your household income, your child should be eligible for Summer EBT benefits. <br/>  <br/> To fill out the application online, go to <a href=\"https://www.michigan.gov/MIBridges\">https://www.michigan.gov/MIBridges</a>. <br/>  <br/> Even if you completed an Education Benefits Form through your child's school this year, you still must apply for Summer EBT in order to receive benefits.", "You may need to apply for Summer EBT benefits for your child. To be eligible, a child must meet one of the following requirements: <br/> 1) Be certified to receive free/reduced-price school meals *and* attend a school participating in the National School Lunch Program or School Breakfast Program, or <br/> 2) Be participating in FAP (food benefits), MA (Medicaid), FIP (cash assistance) or identified as Homeless, Foster, Migrant, Runaway *and* be between the ages of 6 and 18, or <br/> 3) Attend a school participating in the National School Lunch Program or School Breakfast Program *and* have a household income that meets the requirements for Summer EBT. <br/>  <br/> To fill out the application online, go to <a href=\"https://www.michigan.gov/MIBridges\">https://www.michigan.gov/MIBridges</a>. <br/>  <br/> Even if you completed an Education Benefits Form through your child's school this year, you still must apply for Summer EBT in order to receive benefits.", "Your child might not be eligible for Summer EBT but you should apply if you think your child is eligible. To be eligible, a child must meet one of the following requirements: <br/> 1) Be certified to receive free/reduced-price school meals *and* attend a school participating in the National School Lunch Program or School Breakfast Program, or <br/> 2) Be participating in FAP (food benefits), MA (Medicaid), FIP (cash assistance) or identified as Homeless, Foster, Migrant, Runaway *and* be between the ages of 6 and 18, or <br/> 3) Attend a school participating in the National School Lunch Program or School Breakfast Program *and* have a household income that meets the requirements for Summer EBT. <br/>  <br/> To fill out the application online, go to <a href=\"https://www.michigan.gov/MIBridges\">https://www.michigan.gov/MIBridges</a>. <br/>  <br/> Even if you completed an Education Benefits Form through your child's school this year, you still must apply for Summer EBT in order to receive benefits."];

// // create answer_values objects - array of arrays of values mapped to each answer option for each question; used to facilitate mapping user input
// const answer_values = [[1, 2, 1, 0, 0], [1, 1, 1, 1, 0, 0], [1, 0], [1, 2, 0, 0], [1, 0, 0], [], [1, 0, 2]];

// // create answer_types object - define input type for answers
// const answer_types = ["checkbox", "checkbox", "radio", "radio", "radio", "text", "radio"];

// create schools object - list of schools for SCH question
const schools = [{"district": "", "school": "#24 Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Adams", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Adams Central Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Ainsworth City School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Alice Buffett Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "All Saints School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "All Saints School - Holdrege", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "All Saints School - Omaha", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Allen Consolidated Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Alliance Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Alma Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Amherst Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Anselmo-Merna Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Ansley Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Ansley Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Aquinas-St. Mary's School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Arapahoe Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Arcadia Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Archbishop Bergan Catholic School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Arlington Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Arnold Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Arnold Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Arnold Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Ashland Greenwood Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Ashland Park/Robbins", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Auburn Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Aurora Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Axtell Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Bancroft", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bancroft-Rosalie Community School Preschool", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bancroft-Rosalie School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Bancroft-Rosalie School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Banner County School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Banner County School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Barr Jr. High School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Battle Creek Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Bayard Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bayard Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Bayard Secondary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Beals", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Beatrice Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Belle Ryan", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bellevue Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Belmont Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Belvedere", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Benkelman Elementary School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Benkelman High School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bennington Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Benson High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Benson West", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bertrand Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Beveridge Jr High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bishop Neumann High School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Blackburn", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Blair Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Blessed Sacrament School - Lincoln", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Bloomfield School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Blue Hill School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Bluestem Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Boone Central District 1", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Boyd", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Boyd County Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Brady Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Bridgeport Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bridgeport Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Broken Bow Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Brownell Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bruning-Davenport Unified System", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Bryan High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bryan Jr High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Bryant Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Buena Vista", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Buffalo Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Burke High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Burwell Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "C Ray Gates Elementary School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Callaway Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Cambridge Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Campbell Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Career Center", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Carriage Hill Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Castelar", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Cathedral of the Risen Christ", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Catlin", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Cedar Bluffs Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Cedars Youth Services", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Centennial Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Central City Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Central Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Central High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Central Park", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Central Valley Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Centura Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Chadron City Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Chambers Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Chandler View", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Chase County Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Christ Lutheran School - Juniata", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Christ Lutheran School - Norfolk", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Christ Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Christ the King School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Clarkson Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Clinton Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Cody Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Cody Kilgore Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Cody Kilgore Secondary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Cody-Kilgore Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Columbian", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Columbus Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Concordia Lutheran Schools of Omaha, Inc.", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Conestoga", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Conestoga Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Cozad Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Crawford Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Creek Valley Schools/Preschool", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Creighton Community Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Crestridge", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Crete Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Crofton Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Cross County Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Culler Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "David City Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Davis Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Dawes Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Deshler Lutheran School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Deshler Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Diller-Odell Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "District 11 Area Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Dodge", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Dodge Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Doniphan-Trumbull Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Dorchester Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Douglas County West Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Douglas County Youth Center", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Druid Hill", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Dual Language Academy", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Dundee", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Dundy County Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "E N Swett Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "EF Starr Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "ESL Teen Literacy Center", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Early Childhood Center", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Early Learning Center", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "East Butler Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "East Catholic Elementary", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Edison", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Eisenhower Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Elba Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Elba Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Elgin Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Elkhorn Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Elkhorn Valley Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Elliott Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Elm Creek Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Elmwood-Murdock School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Elwood Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Emerson Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Emerson-Hubbard Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Emmanuel Lutheran School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Engleman Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Eustis-Farnam Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Everett Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Fairbury Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Faith Lutheran School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Falls City Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Falls City Sacred Heart Catholic School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Father Flanagan's Boys Home", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Field Club", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Fillmore County School District", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Florence", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Fontenelle", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Forest Station Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Fort Calhoun Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Franklin", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Franklin Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Franklin Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Freeman Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Fremont Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Friend Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Fullerton", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Fullerton Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "G. Stanley Hall Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Garden County Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Gateway Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Gering Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Gibbon Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Gifford Park Elementary School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Gilder", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Giltner Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Golden Hills Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Gomez Heritage", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Good Shepherd Lutheran School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Goodrich Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Gordon-Rushville Elementary at Gordon", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Gordon-Rushville High School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Gordon-Rushville Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Gordon-Rushville Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Gothenburg Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Grand Island Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Gretna Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Guardian Angels Central Catholic Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Hale Jr High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Hampton Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Harrison", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Hartington-Newcastle Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Hartley Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Hartman", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Harvard Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Harvard School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Hastings Catholic Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Hastings Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Hay Springs Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Hayes Center Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Heartland Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Hemingford Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Hershey Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "High Plains Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Highland", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Hildreth School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Hitchcock County School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Holdrege Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Holy Cross School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Holy Family School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Holy Name School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Holy Name School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Holy Trinity School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Homer Community School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Homer Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "HopeSpoke", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Howard Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Howells Community Catholic School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Howells-Dodge Consolidated School District", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Humboldt/Tablerock-Steinauer", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Humphrey Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Huntington Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Immanuel Lutheran School - Columbus", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Indian Hill", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Integrated Learning Program", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Isanti Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Isanti School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "J.P. Lord", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Jackson", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Jefferson", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Jefferson Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Jefferson Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Jesuit Academy", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Jesuit Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Johnson County Central Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Johnson-Brock Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Joslyn", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Karen Western Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Kearney Education Center", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Kearney Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Kellom", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Kenesaw Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Kennedy", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Kennedy Early Childhood Center", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Keya Paha County Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Kimball Jr.-Sr. High School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Kimball Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "King", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "King Science Center", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Knickrehm Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "La Vista West Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Lakeview Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Lakeview Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Laurel-Concord-Coleridge School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Lawrence-Nelson Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Lefler Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Leigh Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Lewis and Clark", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Lewiston Consolidated School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Lewiston Consolidated School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Lexington Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Leyton Elementary--Jr. High in Gurley", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Leyton High School - Dalton", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Leyton Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Liberty Elementary School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Lifegate Christian School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Lincoln Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Lincoln Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Lincoln Heights Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Lincoln Lutheran School Association", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Lincoln Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Litchfield Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Logan View Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Loomis Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Lothrop", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Louisville Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Loup City Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Loup County Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Loup County Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Lourdes Central Catholic School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Lyons-Decatur N.E. School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Madison Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Malcolm Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Marrs Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Mary Lynch Elementary School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Mary Our Queen School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Masters", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Maxwell Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Maywood Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "McCook Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "McCool Junction Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "McMillan Jr High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "McPhee Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Mead Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Medicine Valley School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Meridian Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Milford Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Millard Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Miller Park", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Minatare Elementary School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Minatare High School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Minatare Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Minden Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Minne Lusa", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Mitchell Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Mitchell Tiger Cub", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Monroe Jr High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Morrill Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Morton Jr High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Mount View", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Mullen Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Mullen Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "NELSON MANDELA ELEMENTARY", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "National School Lunch Program (NSLP) Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Nebraska City Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Nebraska Correctional Youth Facility", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Neligh-Oakdale School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Nelson Mandela Elementary School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Newell Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Newman Grove Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Niobrara Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Niobrara Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Norfolk Catholic School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Norfolk Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Norris Jr High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Norris Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "North American Martyrs School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "North Bend Central Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "North High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "North Platte Catholic School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "North Platte Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Northeast NE Juvenile Services, Inc.", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Northwest High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Northwest Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Norwood Park Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "O'Neill Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Oak Valley", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Oakland-Craig Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Ogallala Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Omaha Home For Boys", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Omaha Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Omaha Virtual School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Ord Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Osceola Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Osmond Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Our Lady of Lourdes School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Our Redeemer Lutheran School - Seward", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Overton Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Palmer Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Palmyra District OR 1 School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Panhandle Youth Shelter", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Papillion-La Vista School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Park Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Parkview Heights Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Parrish", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Pawnee", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Pawnee City Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Paxton Consolidated School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Pender Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Perkins County Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Pershing Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Picotte, Sara", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Pierce Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Pine Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Pinewood", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Pius X High School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Plainview Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Plattsmouth Comm. Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Pleasanton Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Ponca", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Ponca Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Pope John XXIII Central Catholic", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Potter-Dix Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Prairie Wind", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Preschool 3YR", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Prescott Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Ralston Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Randolph Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Randolph Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Ravenna Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Raymond Central Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Red Cloud Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Riley Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Riverside Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Rock County Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Roosevelt Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Rosehill", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Sacred Heart School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Sacred Heart School - Omaha", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Saddlebrook Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Sandhills Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Sandy Creek Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Saratoga Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Sargent Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Sargent Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Sarpy County Juvenile Justice Center", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Schuyler Central High School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Schuyler Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Schuyler Elementary School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Schuyler Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Scottsbluff P.S. Preschool", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Scottsbluff Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Scotus Central Catholic", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Scribner-Snyder Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Secondary Success Program", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Seedling Mile Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Senior High School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Seward Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Shelby-Rising City Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Shelton Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Sherman", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Shickley Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Shoemaker Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Sidney Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Silver Lake Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Skinner", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "South High", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "South Platte Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "South Sarpy School District 46", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "South Sioux City School District #11", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Southern Elementary School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Southern Jr.-Sr. High School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Southern Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Southern Valley Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Southwest Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Spalding Academy", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Spring Lake", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Springville", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "St. Agnes Academy - Alliance", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Agnes School - Scottsbluff", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Andrew's School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "St. Andrew's School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Anthony School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Augustine Indian Mission School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "St. Augustine Indian Mission School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Bernadette School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Bernard's School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Cecilia's Cathedral Corp. of Omaha", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Columbkille School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Edward Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "St. Edward Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Francis School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Gerald Catholic School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Isidore Grade School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. James School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. James-Seton School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. John Lutheran School - Seward", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. John Lutheran School-   Battle Creek", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. John Neumann School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. John's Catholic School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Joseph School - Atkinson", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Joseph School - York", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Joseph School- Beatrice", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Joseph's School -  Lincoln", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Leonard's School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Ludger School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Margaret Mary School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Mary's School - Bellevue", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Mary's School - O'Neill", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Mary's School - Ord", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Mary's School - Osmond", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Mary's School - Wayne", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Matthew the Evangelist School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Michael Catholic School - Lincoln", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Michael's School -  South Sioux City", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Michaels School -  Albion", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Patrick's School -  Lincoln", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Patrick's School -  McCook", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Patrick's School - Elkhorn", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Paul Lutheran School -   Beatrice", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Paul Lutheran School -   Ogallala", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Paul Lutheran School -   Utica", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Paul Lutheran School -   West Point", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Paul Lutheran School - Norfolk", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Paul Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Peter and Paul School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "St. Peter and Paul School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Peter's School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Philip Neri School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Pius X/St. Leo School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Robert Bellarmine School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Rose of Lima School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Stephen the Martyr School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Teresa School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Thomas More School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Vincent DePaul Catholic", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Vincent DePaul School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Wenceslaus School - Dodge", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "St. Wenceslaus School - Omaha", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Standing Bear Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Stanton Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Stapleton Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Sterling Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Stolley Park Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Stuart Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Summerland Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Sumner Eddyville Miller School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Sunny Slope", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Superior Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Superior Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Sutherland Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Sutton Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Syracuse-Dunbar-Avoca School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Tekamah-Herman Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Thayer Central Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Thedford High School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Thedford Rural High School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Transition North Site", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Transition-South Site", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Tri County Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Trinity Lutheran School -  Fremont", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Trinity Lutheran School -  Grand Island", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Twin River Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Umo", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Umo 'ho' Nation Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Valentine Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Verdigre Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wahoo Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wakefield Community School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wakonda", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Wallace School District 65R", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Walnut Hill", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Walnut Jr. High School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Walthill Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Walthill Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Washington", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Washington Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Wasmer Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Wauneta School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Wauneta-Palisade Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wausa Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Waverly Public School District #145", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wayne Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Weeping Water Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "West Hastings YRTC", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "West Holt Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "West Kearney High", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "West Lawn Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "West Lincoln Elementary", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "West Point Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Western Hills", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Westridge Middle School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Westside Community Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Westview", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Wheeler Central Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wilber-Clatonia Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wilcox School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Wilcox-Hildreth School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wilson Focus School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Winnebago Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Winnebago Public School", "nslp": 1, "cep": 1, "value": 2},
{"district": "", "school": "Winnebago Tribe of Nebraska Youth Shelter", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Winside Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wisner-Pilger Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wood River Rural Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Wynot Public School", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "York Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Youth Services Center", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Yutan Public Schools", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Zion Classical Academy", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Zion Lutheran School - Kearney", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Zion Lutheran School - Pierce", "nslp": 1, "cep": 0, "value": 1},
{"district": "", "school": "Zion Lutheran School - Plainview", "nslp": 1, "cep": 0, "value": 1}];

// create income_guidelines object - look up income guidelines by household size
const income_guidelines = [{"year": "2025-2026", "household_size": 1, "income_frequency": "annual", "amount": 28953},
{"year": "2025-2026", "household_size": 1, "income_frequency": "monthly", "amount": 2413},
{"year": "2025-2026", "household_size": 1, "income_frequency": "twice per month", "amount": 1207},
{"year": "2025-2026", "household_size": 1, "income_frequency": "every two weeks", "amount": 1114},
{"year": "2025-2026", "household_size": 1, "income_frequency": "weekly", "amount": 557},
{"year": "2025-2026", "household_size": 2, "income_frequency": "annual", "amount": 39128},
{"year": "2025-2026", "household_size": 2, "income_frequency": "monthly", "amount": 3261},
{"year": "2025-2026", "household_size": 2, "income_frequency": "twice per month", "amount": 1631},
{"year": "2025-2026", "household_size": 2, "income_frequency": "every two weeks", "amount": 1505},
{"year": "2025-2026", "household_size": 2, "income_frequency": "weekly", "amount": 753},
{"year": "2025-2026", "household_size": 3, "income_frequency": "annual", "amount": 49303},
{"year": "2025-2026", "household_size": 3, "income_frequency": "monthly", "amount": 4109},
{"year": "2025-2026", "household_size": 3, "income_frequency": "twice per month", "amount": 2055},
{"year": "2025-2026", "household_size": 3, "income_frequency": "every two weeks", "amount": 1897},
{"year": "2025-2026", "household_size": 3, "income_frequency": "weekly", "amount": 949},
{"year": "2025-2026", "household_size": 4, "income_frequency": "annual", "amount": 59478},
{"year": "2025-2026", "household_size": 4, "income_frequency": "monthly", "amount": 4957},
{"year": "2025-2026", "household_size": 4, "income_frequency": "twice per month", "amount": 2479},
{"year": "2025-2026", "household_size": 4, "income_frequency": "every two weeks", "amount": 2288},
{"year": "2025-2026", "household_size": 4, "income_frequency": "weekly", "amount": 1144},
{"year": "2025-2026", "household_size": 5, "income_frequency": "annual", "amount": 69653},
{"year": "2025-2026", "household_size": 5, "income_frequency": "monthly", "amount": 5805},
{"year": "2025-2026", "household_size": 5, "income_frequency": "twice per month", "amount": 2903},
{"year": "2025-2026", "household_size": 5, "income_frequency": "every two weeks", "amount": 2679},
{"year": "2025-2026", "household_size": 5, "income_frequency": "weekly", "amount": 1340},
{"year": "2025-2026", "household_size": 6, "income_frequency": "annual", "amount": 79828},
{"year": "2025-2026", "household_size": 6, "income_frequency": "monthly", "amount": 6653},
{"year": "2025-2026", "household_size": 6, "income_frequency": "twice per month", "amount": 3327},
{"year": "2025-2026", "household_size": 6, "income_frequency": "every two weeks", "amount": 3071},
{"year": "2025-2026", "household_size": 6, "income_frequency": "weekly", "amount": 1536},
{"year": "2025-2026", "household_size": 7, "income_frequency": "annual", "amount": 90003},
{"year": "2025-2026", "household_size": 7, "income_frequency": "monthly", "amount": 7501},
{"year": "2025-2026", "household_size": 7, "income_frequency": "twice per month", "amount": 3751},
{"year": "2025-2026", "household_size": 7, "income_frequency": "every two weeks", "amount": 3462},
{"year": "2025-2026", "household_size": 7, "income_frequency": "weekly", "amount": 1731},
{"year": "2025-2026", "household_size": 8, "income_frequency": "annual", "amount": 100178},
{"year": "2025-2026", "household_size": 8, "income_frequency": "monthly", "amount": 8349},
{"year": "2025-2026", "household_size": 8, "income_frequency": "twice per month", "amount": 4175},
{"year": "2025-2026", "household_size": 8, "income_frequency": "every two weeks", "amount": 3853},
{"year": "2025-2026", "household_size": 8, "income_frequency": "weekly", "amount": 1927},
{"year": "2025-2026", "household_size": 9, "income_frequency": "annual", "amount": 110353},
{"year": "2025-2026", "household_size": 9, "income_frequency": "monthly", "amount": 9197},
{"year": "2025-2026", "household_size": 9, "income_frequency": "twice per month", "amount": 4599},
{"year": "2025-2026", "household_size": 9, "income_frequency": "every two weeks", "amount": 4245},
{"year": "2025-2026", "household_size": 9, "income_frequency": "weekly", "amount": 2123},
{"year": "2025-2026", "household_size": 10, "income_frequency": "annual", "amount": 120528},
{"year": "2025-2026", "household_size": 10, "income_frequency": "monthly", "amount": 10045},
{"year": "2025-2026", "household_size": 10, "income_frequency": "twice per month", "amount": 5023},
{"year": "2025-2026", "household_size": 10, "income_frequency": "every two weeks", "amount": 4637},
{"year": "2025-2026", "household_size": 10, "income_frequency": "weekly", "amount": 2319},
{"year": "2025-2026", "household_size": 11, "income_frequency": "annual", "amount": 130703},
{"year": "2025-2026", "household_size": 11, "income_frequency": "monthly", "amount": 10893},
{"year": "2025-2026", "household_size": 11, "income_frequency": "twice per month", "amount": 5447},
{"year": "2025-2026", "household_size": 11, "income_frequency": "every two weeks", "amount": 5029},
{"year": "2025-2026", "household_size": 11, "income_frequency": "weekly", "amount": 2515},
{"year": "2025-2026", "household_size": 12, "income_frequency": "annual", "amount": 140878},
{"year": "2025-2026", "household_size": 12, "income_frequency": "monthly", "amount": 11741},
{"year": "2025-2026", "household_size": 12, "income_frequency": "twice per month", "amount": 5871},
{"year": "2025-2026", "household_size": 12, "income_frequency": "every two weeks", "amount": 5421},
{"year": "2025-2026", "household_size": 12, "income_frequency": "weekly", "amount": 2711},
{"year": "2025-2026", "household_size": 13, "income_frequency": "annual", "amount": 151053},
{"year": "2025-2026", "household_size": 13, "income_frequency": "monthly", "amount": 12589},
{"year": "2025-2026", "household_size": 13, "income_frequency": "twice per month", "amount": 6295},
{"year": "2025-2026", "household_size": 13, "income_frequency": "every two weeks", "amount": 5813},
{"year": "2025-2026", "household_size": 13, "income_frequency": "weekly", "amount": 2907},
{"year": "2025-2026", "household_size": 14, "income_frequency": "annual", "amount": 161228},
{"year": "2025-2026", "household_size": 14, "income_frequency": "monthly", "amount": 13437},
{"year": "2025-2026", "household_size": 14, "income_frequency": "twice per month", "amount": 6719},
{"year": "2025-2026", "household_size": 14, "income_frequency": "every two weeks", "amount": 6205},
{"year": "2025-2026", "household_size": 14, "income_frequency": "weekly", "amount": 3103},
{"year": "2025-2026", "household_size": 15, "income_frequency": "annual", "amount": 171403},
{"year": "2025-2026", "household_size": 15, "income_frequency": "monthly", "amount": 14285},
{"year": "2025-2026", "household_size": 15, "income_frequency": "twice per month", "amount": 7143},
{"year": "2025-2026", "household_size": 15, "income_frequency": "every two weeks", "amount": 6597},
{"year": "2025-2026", "household_size": 15, "income_frequency": "weekly", "amount": 3299},
{"year": "2025-2026", "household_size": 16, "income_frequency": "annual", "amount": 181578},
{"year": "2025-2026", "household_size": 16, "income_frequency": "monthly", "amount": 15133},
{"year": "2025-2026", "household_size": 16, "income_frequency": "twice per month", "amount": 7567},
{"year": "2025-2026", "household_size": 16, "income_frequency": "every two weeks", "amount": 6989},
{"year": "2025-2026", "household_size": 16, "income_frequency": "weekly", "amount": 3495},
{"year": "2025-2026", "household_size": 17, "income_frequency": "annual", "amount": 191753},
{"year": "2025-2026", "household_size": 17, "income_frequency": "monthly", "amount": 15981},
{"year": "2025-2026", "household_size": 17, "income_frequency": "twice per month", "amount": 7991},
{"year": "2025-2026", "household_size": 17, "income_frequency": "every two weeks", "amount": 7381},
{"year": "2025-2026", "household_size": 17, "income_frequency": "weekly", "amount": 3691},
{"year": "2025-2026", "household_size": 18, "income_frequency": "annual", "amount": 201928},
{"year": "2025-2026", "household_size": 18, "income_frequency": "monthly", "amount": 16829},
{"year": "2025-2026", "household_size": 18, "income_frequency": "twice per month", "amount": 8415},
{"year": "2025-2026", "household_size": 18, "income_frequency": "every two weeks", "amount": 7773},
{"year": "2025-2026", "household_size": 18, "income_frequency": "weekly", "amount": 3887},
{"year": "2025-2026", "household_size": 19, "income_frequency": "annual", "amount": 212103},
{"year": "2025-2026", "household_size": 19, "income_frequency": "monthly", "amount": 17677},
{"year": "2025-2026", "household_size": 19, "income_frequency": "twice per month", "amount": 8839},
{"year": "2025-2026", "household_size": 19, "income_frequency": "every two weeks", "amount": 8165},
{"year": "2025-2026", "household_size": 19, "income_frequency": "weekly", "amount": 4083},
{"year": "2025-2026", "household_size": 20, "income_frequency": "annual", "amount": 222278},
{"year": "2025-2026", "household_size": 20, "income_frequency": "monthly", "amount": 18525},
{"year": "2025-2026", "household_size": 20, "income_frequency": "twice per month", "amount": 9263},
{"year": "2025-2026", "household_size": 20, "income_frequency": "every two weeks", "amount": 8557},
{"year": "2025-2026", "household_size": 20, "income_frequency": "weekly", "amount": 4279},
{"year": "2025-2026", "household_size": "additional", "income_frequency": "annual", "amount": 10175},
{"year": "2025-2026", "household_size": "additional", "income_frequency": "monthly", "amount": 848},
{"year": "2025-2026", "household_size": "additional", "income_frequency": "twice per month", "amount": 424},
{"year": "2025-2026", "household_size": "additional", "income_frequency": "every two weeks", "amount": 392},
{"year": "2025-2026", "household_size": "additional", "income_frequency": "weekly", "amount": 196},
{"year": "2024-2025", "household_size": 1, "income_frequency": "annual", "amount": 27861},
{"year": "2024-2025", "household_size": 1, "income_frequency": "monthly", "amount": 2322},
{"year": "2024-2025", "household_size": 1, "income_frequency": "twice per month", "amount": 1161},
{"year": "2024-2025", "household_size": 1, "income_frequency": "every two weeks", "amount": 1072},
{"year": "2024-2025", "household_size": 1, "income_frequency": "weekly", "amount": 536},
{"year": "2024-2025", "household_size": 2, "income_frequency": "annual", "amount": 37814},
{"year": "2024-2025", "household_size": 2, "income_frequency": "monthly", "amount": 3152},
{"year": "2024-2025", "household_size": 2, "income_frequency": "twice per month", "amount": 1576},
{"year": "2024-2025", "household_size": 2, "income_frequency": "every two weeks", "amount": 1455},
{"year": "2024-2025", "household_size": 2, "income_frequency": "weekly", "amount": 728},
{"year": "2024-2025", "household_size": 3, "income_frequency": "annual", "amount": 47767},
{"year": "2024-2025", "household_size": 3, "income_frequency": "monthly", "amount": 3981},
{"year": "2024-2025", "household_size": 3, "income_frequency": "twice per month", "amount": 1991},
{"year": "2024-2025", "household_size": 3, "income_frequency": "every two weeks", "amount": 1838},
{"year": "2024-2025", "household_size": 3, "income_frequency": "weekly", "amount": 919},
{"year": "2024-2025", "household_size": 4, "income_frequency": "annual", "amount": 57720},
{"year": "2024-2025", "household_size": 4, "income_frequency": "monthly", "amount": 4810},
{"year": "2024-2025", "household_size": 4, "income_frequency": "twice per month", "amount": 2405},
{"year": "2024-2025", "household_size": 4, "income_frequency": "every two weeks", "amount": 2220},
{"year": "2024-2025", "household_size": 4, "income_frequency": "weekly", "amount": 1110},
{"year": "2024-2025", "household_size": 5, "income_frequency": "annual", "amount": 67673},
{"year": "2024-2025", "household_size": 5, "income_frequency": "monthly", "amount": 5640},
{"year": "2024-2025", "household_size": 5, "income_frequency": "twice per month", "amount": 2820},
{"year": "2024-2025", "household_size": 5, "income_frequency": "every two weeks", "amount": 2603},
{"year": "2024-2025", "household_size": 5, "income_frequency": "weekly", "amount": 1302},
{"year": "2024-2025", "household_size": 6, "income_frequency": "annual", "amount": 77626},
{"year": "2024-2025", "household_size": 6, "income_frequency": "monthly", "amount": 6469},
{"year": "2024-2025", "household_size": 6, "income_frequency": "twice per month", "amount": 3235},
{"year": "2024-2025", "household_size": 6, "income_frequency": "every two weeks", "amount": 2986},
{"year": "2024-2025", "household_size": 6, "income_frequency": "weekly", "amount": 1493},
{"year": "2024-2025", "household_size": 7, "income_frequency": "annual", "amount": 87579},
{"year": "2024-2025", "household_size": 7, "income_frequency": "monthly", "amount": 7299},
{"year": "2024-2025", "household_size": 7, "income_frequency": "twice per month", "amount": 3650},
{"year": "2024-2025", "household_size": 7, "income_frequency": "every two weeks", "amount": 3369},
{"year": "2024-2025", "household_size": 7, "income_frequency": "weekly", "amount": 1685},
{"year": "2024-2025", "household_size": 8, "income_frequency": "annual", "amount": 97532},
{"year": "2024-2025", "household_size": 8, "income_frequency": "monthly", "amount": 8128},
{"year": "2024-2025", "household_size": 8, "income_frequency": "twice per month", "amount": 4064},
{"year": "2024-2025", "household_size": 8, "income_frequency": "every two weeks", "amount": 3752},
{"year": "2024-2025", "household_size": 8, "income_frequency": "weekly", "amount": 1876},
{"year": "2024-2025", "household_size": 9, "income_frequency": "annual", "amount": 107485},
{"year": "2024-2025", "household_size": 9, "income_frequency": "monthly", "amount": 8958},
{"year": "2024-2025", "household_size": 9, "income_frequency": "twice per month", "amount": 4479},
{"year": "2024-2025", "household_size": 9, "income_frequency": "every two weeks", "amount": 4135},
{"year": "2024-2025", "household_size": 9, "income_frequency": "weekly", "amount": 2068},
{"year": "2024-2025", "household_size": 10, "income_frequency": "annual", "amount": 117438},
{"year": "2024-2025", "household_size": 10, "income_frequency": "monthly", "amount": 9788},
{"year": "2024-2025", "household_size": 10, "income_frequency": "twice per month", "amount": 4894},
{"year": "2024-2025", "household_size": 10, "income_frequency": "every two weeks", "amount": 4518},
{"year": "2024-2025", "household_size": 10, "income_frequency": "weekly", "amount": 2260},
{"year": "2024-2025", "household_size": 11, "income_frequency": "annual", "amount": 127391},
{"year": "2024-2025", "household_size": 11, "income_frequency": "monthly", "amount": 10618},
{"year": "2024-2025", "household_size": 11, "income_frequency": "twice per month", "amount": 5309},
{"year": "2024-2025", "household_size": 11, "income_frequency": "every two weeks", "amount": 4901},
{"year": "2024-2025", "household_size": 11, "income_frequency": "weekly", "amount": 2452},
{"year": "2024-2025", "household_size": 12, "income_frequency": "annual", "amount": 137344},
{"year": "2024-2025", "household_size": 12, "income_frequency": "monthly", "amount": 11448},
{"year": "2024-2025", "household_size": 12, "income_frequency": "twice per month", "amount": 5724},
{"year": "2024-2025", "household_size": 12, "income_frequency": "every two weeks", "amount": 5284},
{"year": "2024-2025", "household_size": 12, "income_frequency": "weekly", "amount": 2644},
{"year": "2024-2025", "household_size": 13, "income_frequency": "annual", "amount": 147297},
{"year": "2024-2025", "household_size": 13, "income_frequency": "monthly", "amount": 12278},
{"year": "2024-2025", "household_size": 13, "income_frequency": "twice per month", "amount": 6139},
{"year": "2024-2025", "household_size": 13, "income_frequency": "every two weeks", "amount": 5667},
{"year": "2024-2025", "household_size": 13, "income_frequency": "weekly", "amount": 2836},
{"year": "2024-2025", "household_size": 14, "income_frequency": "annual", "amount": 157250},
{"year": "2024-2025", "household_size": 14, "income_frequency": "monthly", "amount": 13108},
{"year": "2024-2025", "household_size": 14, "income_frequency": "twice per month", "amount": 6554},
{"year": "2024-2025", "household_size": 14, "income_frequency": "every two weeks", "amount": 6050},
{"year": "2024-2025", "household_size": 14, "income_frequency": "weekly", "amount": 3028},
{"year": "2024-2025", "household_size": 15, "income_frequency": "annual", "amount": 167203},
{"year": "2024-2025", "household_size": 15, "income_frequency": "monthly", "amount": 13938},
{"year": "2024-2025", "household_size": 15, "income_frequency": "twice per month", "amount": 6969},
{"year": "2024-2025", "household_size": 15, "income_frequency": "every two weeks", "amount": 6433},
{"year": "2024-2025", "household_size": 15, "income_frequency": "weekly", "amount": 3220},
{"year": "2024-2025", "household_size": 16, "income_frequency": "annual", "amount": 177156},
{"year": "2024-2025", "household_size": 16, "income_frequency": "monthly", "amount": 14768},
{"year": "2024-2025", "household_size": 16, "income_frequency": "twice per month", "amount": 7384},
{"year": "2024-2025", "household_size": 16, "income_frequency": "every two weeks", "amount": 6816},
{"year": "2024-2025", "household_size": 16, "income_frequency": "weekly", "amount": 3412},
{"year": "2024-2025", "household_size": 17, "income_frequency": "annual", "amount": 187109},
{"year": "2024-2025", "household_size": 17, "income_frequency": "monthly", "amount": 15598},
{"year": "2024-2025", "household_size": 17, "income_frequency": "twice per month", "amount": 7799},
{"year": "2024-2025", "household_size": 17, "income_frequency": "every two weeks", "amount": 7199},
{"year": "2024-2025", "household_size": 17, "income_frequency": "weekly", "amount": 3604},
{"year": "2024-2025", "household_size": 18, "income_frequency": "annual", "amount": 197062},
{"year": "2024-2025", "household_size": 18, "income_frequency": "monthly", "amount": 16428},
{"year": "2024-2025", "household_size": 18, "income_frequency": "twice per month", "amount": 8214},
{"year": "2024-2025", "household_size": 18, "income_frequency": "every two weeks", "amount": 7582},
{"year": "2024-2025", "household_size": 18, "income_frequency": "weekly", "amount": 3796},
{"year": "2024-2025", "household_size": 19, "income_frequency": "annual", "amount": 207015},
{"year": "2024-2025", "household_size": 19, "income_frequency": "monthly", "amount": 17258},
{"year": "2024-2025", "household_size": 19, "income_frequency": "twice per month", "amount": 8629},
{"year": "2024-2025", "household_size": 19, "income_frequency": "every two weeks", "amount": 7965},
{"year": "2024-2025", "household_size": 19, "income_frequency": "weekly", "amount": 3988},
{"year": "2024-2025", "household_size": 20, "income_frequency": "annual", "amount": 216968},
{"year": "2024-2025", "household_size": 20, "income_frequency": "monthly", "amount": 18088},
{"year": "2024-2025", "household_size": 20, "income_frequency": "twice per month", "amount": 9044},
{"year": "2024-2025", "household_size": 20, "income_frequency": "every two weeks", "amount": 8348},
{"year": "2024-2025", "household_size": 20, "income_frequency": "weekly", "amount": 4180},
{"year": "2024-2025", "household_size": "additional", "income_frequency": "annual", "amount": 9953},
{"year": "2024-2025", "household_size": "additional", "income_frequency": "monthly", "amount": 830},
{"year": "2024-2025", "household_size": "additional", "income_frequency": "twice per month", "amount": 415},
{"year": "2024-2025", "household_size": "additional", "income_frequency": "every two weeks", "amount": 383},
{"year": "2024-2025", "household_size": "additional", "income_frequency": "weekly", "amount": 192}];

// // component_by_language - facilitate building question map by filtering components by language
// function component_by_language(component, language) {
//     return Object.values(
//         Object.fromEntries(
//             Object.entries(component).filter(([key, value]) => key == language)
//         )
//     )[0];
// };

// console.log(component_by_language(question_text, "en")[0]); 

// populate question_map to facilitate question display
// for (i = 0; i < codes.length; i++) {

    // let content_type_map = new Map();
    // let language_map = new Map();
    // let content_map = new Map();
// };
// for (i = 0; i < codes.length; i++) {
//     languages.forEach((language) => {
//         let question_text_array = component_by_language(question_text, language);
//         let answers_array = component_by_language(answers, language);
//         temp_question = new Question(codes[i], language, question_text_array[i], answers_array[i], answer_values[i], answer_types[i]);
//         question_map.set(codes[i] + "_" + language, temp_question);
//     });
// };
// console.log(Array.from(question_map));
// console.log(question_map.get("SCP_en").question);

// populate outcome_map to facilitate outcome display
// for (i = 0; i < outcome_codes.length; i++) {
//     temp_outcome = new Outcome(outcome_codes[i], outcome_messages[i]);
//     outcome_map.set(outcome_codes[i], temp_outcome);
// };

var intro = {
    en: {
        "cta": "Learn your next steps for receiving $120 for groceries this summer",
        "about": "The Nebraska Summer EBT (S-EBT) Eligibility Checker will ask you a few questions about your child to help you understand if you will receive $120 automatically or if you will need to apply. \n\n Many children in Nebraska are automatically enrolled in Summer EBT, but some families need to apply for their children to receive the program. Use the eligibility checker to see if your child qualifies automatically or if you should sign up. If you have multiple children, please check for each child individually. \n\n This is <em>not</em> the Nebraska Summer EBT application. If you are looking for the application you can find that at <a href=\"https://schools.scriptapp.com/#/inbox/to-do?workflowIdForNewSubmission=1864994403f041e0f4a6144b44b1cfa4a2a57618d7\">this link</a>. You will be provided with the link to the application at the end of the eligibility checker if it determines you should apply.",
        "level_set_header": "Before you get started on this form",
        "level_set_body": "It will take most people less than two minutes to complete this form. You will not need to provide any sensitive information about your child, but you may be asked if your child: \n <ul> \n <li>Is enrolled in programs like SNAP</li> \n <li>Has been approved for free or reduced-price school meals</li> \n <li>Has a household income that is eligible to receive Summer EBT</li> \n </ul> \n\n This form does <em>not</em> save your answers, and your answers will not be shared with anyone.",
        "instructions_header": "How to complete this form",
        "instructions_body": "For each question, tap/click the radio button ( <input type=\"radio\" /> ) or checkboxes ( <input type=\"checkbox\" /> ) that best describe your child, and then tap/click the \"next question\" button. If you need to change your answer to a previous question, tap/click the \"go back\" button.",
        "get_started": "Tap or click the \"next question\" button to get started!"
    },
    es: {
        "cta": "Conozca sus próximos pasos para recibir $120 para comestibles este verano",
        "about": "<p>Esta herramienta le ayuda a entender si necesitas inscribir a tu hijo para que reciba Summer EBT.</p> <p>Muchos niños de Nebraska se inscriben automáticamente en Summer EBT, pero algunas familias necesitan solicitar que sus hijos reciban el programa. Utilice esta herramienta para verificar si su hijo es elegible y califica automáticamente, o si debe inscribirse. Si usted tiene varios hijos, por favor verifique para cada niño individualmente.</p> <p><b>Esta no es la solicitud de Summer EBT de Nebraska.</b> Si está buscando la solicitud, puede encontrarla en este enlace: <a href=\"https://bit.ly/NE-SEBT-application\">https://bit.ly/NE-SEBT-application</a>. Se le proporcionará el enlace a la aplicación al final de la comprobación de elegibilidad si se determina que usted debe aplicar.</p>",
        "level_set_header": "Antes de empezar a rellenar el formulario",
        "level_set_body": "<p>A la mayoría de las personas les llevará menos de dos minutos rellenar este formulario. No tendrá que facilitar ninguna información confidencial sobre su hijo, pero es posible que se le pregunte si su hijo:</p> <ul> <li>Está inscrito en programas como SNAP</li> <li>Ha sido aprobado para recibir comidas escolares gratuitas o a precio reducido</li> <li>Tiene unos ingresos familiares que le permiten recibir Summer EBT</li> </ul>",
        "instructions_header": "Cómo utilizar esta herramienta",
        "instructions_body": "Para cada pregunta, pulse o haga clic en el botón ( <input type=\"radio\" /> ) o las casillas ( <input type=\"checkbox\" /> ) que mejor describan a su hijo/a y luego toque o haga clic en el botón \"Siguiente pregunta\". Si necesita cambiar la respuesta de una pregunta anterior, toque o haga clic en el botón \"Atrás\".",
        "get_started": "Pulse o haga clic en el botón “Siguiente pregunta” para empezar."
    } 
};

let button_text = {
    back: {
        en: "go back",
        es: "atrás"
    },
    next: {
        en: "next question",
        es: "siguiente pregunta"
    },
    reset: {
        en: "start over",
        es: "otro hijo"
    }
};