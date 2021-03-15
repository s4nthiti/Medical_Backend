const db = require("../_helpers/db");

module.exports = {
    addMedicine,
    deleteMedicine,
    getAll,
    getByName
};

async function addMedicine(medicineName){
    const medicine = new db.Medicine(medicineName);
    const checkExist = await db.Medicine.findOne( medicineName );
    if(!checkExist)
    {
        await medicine.save();
        return 'success';
    }
    else
        return 'Medicine Duplicate';
}

async function deleteMedicine(medicineName){
    const medicine = await db.Medicine.findOne( medicineName );
    await medicine.remove();
    return 'success';
}

async function getAll(){
    const medicines = await db.Medicine.find().sort({medicineName:1});
    return medicines.map(x => basicDetails(x));
}

async function getByName(name){
    var selector = {medicineName: {$regex: name.medicineName, $options:"i"}}
    const medicines = await db.Medicine.find(selector).sort({medicineName:1});
    return medicines.map(x => basicDetails(x));
}

function basicDetails(medicine) {
    const { medicineName } = medicine;
    return { medicineName };
}