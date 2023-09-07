import PGPROMISE from "pg-promise";
import {dev} from "$app/environment";

export default class DatabaseInterface {

    private static PGP = PGPROMISE({});

    public static DB: PGPROMISE.IDatabase<PGPROMISE.IResultExt> = undefined;


    public static async connect() {
        const PASS = import.meta.env.VITE_DATABASE_PASS;        
        this.DB = await this.PGP({
            host: dev ? "159.89.40.53" : "localhost",
            port: 5432,
            database: dev ? "pwctest2022" : "pwctest2022" /* replace this one with production database when created */,
            user: "postgres",
            password: PASS,
            max: 30,
        });
    }

    public static async setup() {
        //
    }
}