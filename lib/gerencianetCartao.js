export class GerencianetCartao {
  static _instance;
  _identificador_conta;
  _is_producao;

  constructor(_identificador_conta, _is_producao) {
    this._identificador_conta = _identificador_conta;
    this._is_producao = _is_producao;
  }

  static async instance(_identificador_conta, _is_producao = true) {
    const gnSdk = new GerencianetCartao(_identificador_conta, _is_producao);

    if (!document.getElementById(_identificador_conta)) {
      await gnSdk._init(_identificador_conta, _is_producao);
    }

    return gnSdk;
  }

  async getPaymentToken(cartao) {

    return new Promise((resolve, reject) => {

      window["$gn"].ready((checkout) => {

        window["$gn"]?.checkout?.getPaymentToken(cartao, (error, response) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(response.data);
          }
        });
      });

      window["$gn"]?.checkout?.getPaymentToken(cartao, (error, response) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(response.data);
        }
      });


    });
  }

  async getInstallments(
    it_valor,
    vc_bandeira
  ) {
    return new Promise((resolve, reject) => {
      window["$gn"].ready((checkout) => {
        checkout.getInstallments(it_valor, vc_bandeira, (error, response) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(response.data);
          }
        });
      });
    });
  }

  _init() {
    return new Promise((resolve, reject) => {

      if (!!document.getElementById(this._identificador_conta)) resolve(true)

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = () => resolve(true);
      script.onerror = () => {
        reject(true);
        document.getElementById(this._identificador_conta)?.remove();
      };

      const ambiente_gn = this._is_producao ? "api" : "sandbox";
      const v = Math.ceil(Math.random() * 1000000);
      script.src = `https://${ambiente_gn}.gerencianet.com.br/v1/cdn/${this._identificador_conta}/${v}`;

      script.async = false;
      script.id = this._identificador_conta;

      if (!document.getElementById(this._identificador_conta)) {
        document.getElementsByTagName("head")[0].appendChild(script);
      }

      window["$gn"] = {
        validForm: true,
        processed: false,
        done: {},
        ready: function (fn) {
          window["$gn"].done = fn;
        },
      };

    });
  }
}